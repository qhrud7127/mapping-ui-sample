import {useMapper} from "../../hooks/use-mapper.ts";
import {useCallback, useRef, useState} from "react";
import {Accordion, AccordionDetails, AccordionSummary} from "@mui/material";
import {Check, ChevronDown, CircleDotDashed, Pencil, Table2, Trash2} from "lucide-react";
import {useReactFlow} from "@xyflow/react";
import {IconTooltipButton} from "../../components/button/icon-tooltip-button.tsx";
import {Input} from "../../components/input/input.tsx";
import {useDialog} from "../../hooks/use-dialog.ts";

export const Relationship = ({relationship, expanded, onChange}: any) => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const {deleteElements, setEdges, fitView} = useReactFlow();
  const [relationshipName, setRelationshipName] = useState<string>(relationship.name);
  const {
    updateRelationship, removeRelationship, getTable, getField
  } = useMapper();
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


  const enterEditMode = () => {
    setEditMode(true);
  };


  const focusOnRelationship = useCallback(
    () => {
      setEdges((edges) =>
        edges.map((edge) =>
          edge.id == relationship.id
            ? {
              ...edge,
              selected: true,
            }
            : {
              ...edge,
              selected: false,
            }
        )
      );
      fitView({
        duration: 500,
        maxZoom: 1,
        minZoom: 1,
        nodes: [
          {
            id: relationship.sourceTableId,
          },
          {
            id: relationship.targetTableId,
          },
        ],
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


  const editRelationshipName = useCallback(() => {
    if (!editMode) return;
    if (relationshipName.trim() && relationshipName !== relationship.name) {
      updateRelationship(relationship.id, {
        name: relationshipName.trim(),
      });
    }

    setEditMode(false);
  }, [
    relationshipName,
    relationship.id,
    updateRelationship,
    editMode,
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
            {editMode ? (
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
            )}</div>
          <div className="flex flex-row-reverse">
            {!editMode ? (
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
          <div className={"border-2 py-2 px-5 rounded-lg min-w-16"}>
            <div className="flex gap-2 items-center">
              <Table2 className="size-3.5 shrink-0"/>
              <p className="truncate font-bold text-base">
                {sourceTable?.name}
              </p>
            </div>
            <p className="truncate text-sm">
              {sourceField?.name} ({sourceField?.type.name})
            </p>
          </div>
          <div className={"border-2 py-2 px-5 rounded-lg min-w-16"}>
            <div className="flex gap-2 items-center">
              <Table2 className="size-3.5 shrink-0"/>
              <p className="truncate font-bold text-base">
                {targetTable?.name}
              </p>
            </div>
            <p className="truncate text-sm">
              {targetField?.name} ({targetField?.type.name})
            </p>
          </div>
        </div>
      </AccordionDetails>
    </Accordion>
  )
}
