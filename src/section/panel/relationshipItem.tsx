import {useDataMapper} from "../../hooks/use-data-mapper.ts";
import React, {SyntheticEvent, useCallback, useRef, useState} from "react";
import {Accordion, AccordionDetails, AccordionSummary} from "@mui/material";
import {Check, ChevronDown, CircleDotDashed, Pencil, Plus, Repeat, Trash2} from "lucide-react";
import {useReactFlow} from "@xyflow/react";
import {IconTooltipButton} from "../../components/button/icon-tooltip-button.tsx";
import {Input} from "../../components/input/input.tsx";
import {useDialog} from "../../hooks/use-dialog.ts";
import {Transformation} from "../../lib/domain/transformation.ts";
import {generateId} from "../../lib/utils.ts";
import {RelationshipInfo} from "./relationship-info.tsx";
import {TransformationInfo} from "./transformation-info.tsx";
import {Relationship} from "../../lib/domain/relationship.ts";

export interface RelationshipProps {
  relationship: Relationship;
  expanded: boolean;
  onChange: (_e: SyntheticEvent, isExpanded: boolean) => void;
}

export const RelationshipItem = ({relationship, expanded, onChange}: RelationshipProps) => {
  const [editNameMode, setEditNameMode] = useState<boolean>(false);
  const [editTransformMode, setEditTransformMode] = useState<boolean>(false);
  const {deleteElements, setEdges, fitView} = useReactFlow();
  const [relationshipName, setRelationshipName] = useState<string>(relationship.name);
  const [transforms, setTransforms] = useState<Transformation[]>(relationship?.transformations ?? []);
  const {
    updateRelationship, removeRelationship, getTable, getField
  } = useDataMapper();
  const inputRef = useRef<HTMLInputElement>(null);
  const {showAlert} = useDialog();

  const targetTable = getTable(relationship.targetTableId);
  const targetField = getField(
    relationship.targetTableId,
    relationship.targetFieldId
  );

  const sourceTable = getTable(relationship.sourceTableId);
  const sourceField = getField(
    relationship.sourceTableId,
    relationship.sourceFieldId
  );


  const enterEditMode = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setEditNameMode(true);
  };

  const enterTransformEditMode = () => {
    setEditTransformMode(true);
  };


  const focusOnRelationship = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      setEdges((edges) =>
        edges.map((edge) =>
          edge.id == relationship.id
            ? {...edge, selected: true}
            : {...edge, selected: false}
        )
      );
      fitView({
        duration: 500,
        maxZoom: 1,
        minZoom: 1,
        nodes: [{id: relationship.sourceTableId}, {id: relationship.targetTableId}],
      });
    },
    [
      fitView,
      relationship.sourceTableId,
      relationship.targetTableId,
      setEdges,
      relationship.id,
    ]
  );

  const editTransform = useCallback(() => {
    if (!editTransformMode) return;
    updateRelationship(relationship.id, {
      transformations: transforms,
    });
    setEditTransformMode(false);
  }, [editTransformMode, relationship.id, transforms, updateRelationship]);


  const editRelationshipName = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!editNameMode) return;
    if (relationshipName.trim() && relationshipName !== relationship.name) {
      updateRelationship(relationship.id, {
        name: relationshipName.trim(),
      });
    }

    setEditNameMode(false);
  }, [
    relationshipName,
    relationship.id,
    updateRelationship,
    editNameMode,
    relationship.name,
  ]);

  const deleteRelationshipHandler = useCallback(() => {
    removeRelationship(relationship.id);
    deleteElements({
      edges: [{id: relationship.id}],
    });
  }, [relationship.id, removeRelationship, deleteElements]);

  const showDeleteConfirmation = useCallback(() => {
    showAlert({
      title: '삭제',
      description: '선택한 항목을 삭제하시겠습니까?',
      actionLabel: '삭제',
      closeLabel: '취소',
      onAction: deleteRelationshipHandler,
    });
  }, [deleteRelationshipHandler, showAlert]);

  const addTransform = () => {
    setTransforms(e => [...e, {id: generateId(), type: 'Prefix', value: ''}])
  }

  return (
    <Accordion expanded={expanded}
               onChange={onChange}
               className={'text-gray-600 dark:text-primary bg-slate-200 px-2 dark:bg-slate-900 border-b-2'}
    >
      <AccordionSummary
        expandIcon={<ChevronDown className={'text-gray-600 dark:text-primary'}/>}
        aria-controls="panel1-content"
        sx={{flexDirection: 'row-reverse', gap: 2}}
      >
        <div className="group flex h-7 flex-1 items-center justify-between overflow-hidden m-0">
          <div className="flex min-w-0 flex-1">
            {editNameMode ? (
              <Input
                ref={inputRef}
                autoFocus
                type="text"
                placeholder={relationship.name}
                value={relationshipName}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => setRelationshipName(e.target.value)}
                className="h-7 w-full focus-visible:ring-0"
              />
            ) : (
              <div className="truncate text-sm">{relationship.name}</div>
            )}
          </div>
          <div className="flex flex-row-reverse">
            {!editNameMode ? (
              <>
                <div className="flex flex-row-reverse md:hidden md:group-hover:flex">
                  <IconTooltipButton title={'수정'} clickEvent={enterEditMode}>
                    <Pencil className="size-4"/>
                  </IconTooltipButton>
                  <IconTooltipButton title={'focus'} clickEvent={focusOnRelationship}>
                    <CircleDotDashed className="size-4"/>
                  </IconTooltipButton>
                  <IconTooltipButton title={'삭제'} clickEvent={showDeleteConfirmation}>
                    <Trash2 className="size-4"/>
                  </IconTooltipButton>
                </div>
              </>
            ) : (
              <IconTooltipButton title={'완료'} clickEvent={editRelationshipName}>
                <Check className="size-4"/>
              </IconTooltipButton>
            )}
          </div>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <div className="flex gap-2 overflow-hidden justify-around truncate text-left text-sm">
          <RelationshipInfo table={sourceTable} field={sourceField}/>
          <RelationshipInfo table={targetTable} field={targetField}/>
        </div>
        <div>
          <div className="flex gap-2 items-center justify-between my-4">
            <div className={'flex items-center gap-4'}>
              <Repeat className="size-3.5 shrink-0"/>
              <p className="truncate font-bold text-base">
                Transformations
              </p>
            </div>
            <div className="flex justify-between">
              {editTransformMode ?
                (<>
                  <IconTooltipButton title={'추가'} clickEvent={addTransform}>
                    <Plus className="size-4"/>
                  </IconTooltipButton>
                  <IconTooltipButton title={'완료'} clickEvent={editTransform}>
                    <Check className="size-4"/>
                  </IconTooltipButton></>) :
                (<IconTooltipButton title={'수정'} clickEvent={enterTransformEditMode}>
                  <Pencil className="size-4"/>
                </IconTooltipButton>)}
            </div>
          </div>
          {transforms.map(transform => (
            <TransformationInfo
              key={transform.id}
              transform={transform}
              editTransformMode={editTransformMode}
              setTransforms={setTransforms}
            />
          ))}
        </div>
      </AccordionDetails>
    </Accordion>
  )
}
