import {useChartDB} from "../../hooks/use-chartdb.ts";
import {useCallback, useEffect, useState} from "react";
import {Accordion, AccordionDetails, AccordionSummary, TextField} from "@mui/material";
import {Check, ChevronDown, CircleDotDashed, Pencil, Trash2} from "lucide-react";
import {useReactFlow} from "@xyflow/react";
import {IconTooltipButton} from "../../components/icon-tooltip-button.tsx";

export const Relationship = ({relationship}: any) => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [expand, setExpand] = useState<boolean>(false);
  const toggleAccordion = () => {
    setExpand((prev) => !prev);
  };
  const {deleteElements, setEdges, fitView} = useReactFlow();
  const [relationshipName, setRelationshipName] = useState<string>(relationship.name);
  const {
    selectedRelationship, updateRelationship, removeRelationship, getTable, getField
  } = useChartDB();

  useEffect(() => {
    console.log(relationship)
    console.log(selectedRelationship);
  }, [selectedRelationship]);

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

  return (
    <Accordion expanded={expand}>
      <AccordionSummary
        expandIcon={<ChevronDown onClick={toggleAccordion}/>}
        aria-controls="panel1-content"
        id="panel1-header"
        sx={{flexDirection: 'row-reverse', gap: 2}}
      >
        <div className="group flex h-11 flex-1 items-center justify-between overflow-hidden">
          <div className="flex min-w-0 flex-1">
            {editMode ? (
              <TextField
                className="w-full focus-visible:ring-0"
                value={relationshipName}
                onChange={(e) => setRelationshipName(e.target.value)}
              ></TextField>
            ) : (
              <div className="truncate">{relationship.name}</div>
            )}</div>
          <div className="flex flex-row-reverse">
            {!editMode ? (
              <>
                <div className="flex flex-row-reverse md:hidden md:group-hover:flex">
                  <IconTooltipButton title={'수정'} clickEvent={enterEditMode}>
                    <Pencil/>
                  </IconTooltipButton>
                  <IconTooltipButton title={'focus'} clickEvent={focusOnRelationship}>
                    <CircleDotDashed/>
                  </IconTooltipButton>
                  <IconTooltipButton title={'삭제'} clickEvent={deleteRelationshipHandler}>
                    <Trash2/>
                  </IconTooltipButton>
                </div>
              </>
            ) : (
              <IconTooltipButton title={'완료'} clickEvent={editRelationshipName}>
                <Check/>
              </IconTooltipButton>
            )}
          </div>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <div className="flex gap-2 overflow-hidden text-xs justify-around">
          <div className="truncate text-left text-sm ">
            {sourceTable?.name}({sourceField?.name})
          </div>
          <div className="truncate text-left text-sm">
            {targetTable?.name}({targetField?.name})
          </div>
        </div>
      </AccordionDetails>
    </Accordion>
  )
}
