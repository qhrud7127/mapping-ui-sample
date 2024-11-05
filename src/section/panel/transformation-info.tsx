import {Transformation, TransformationTypes} from "../../lib/domain/transformation.ts";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../../components/select/select.tsx";
import {IconTooltipButton} from "../../components/button/icon-tooltip-button.tsx";
import {Trash2} from "lucide-react";
import {Input} from "../../components/input/input.tsx";
import {ChangeEvent} from "react";

export interface TransformationInfoProps {
  transform: Transformation;
  editTransformMode: boolean;
  setTransforms: (transforms: (transforms: Transformation[]) => Transformation[]) => void;
}

export const TransformationInfo = ({transform, editTransformMode, setTransforms}: TransformationInfoProps) => {

  const updateTransformValue = (value: ChangeEvent<HTMLInputElement>, id: string) => {
    setTransforms((transforms: Transformation[]) => transforms.map((t: Transformation) => {
      if (t.id == id) {
        t.value = String(value.eventPhase)
        return t;
      } else return t;
    }))
  }

  const updateTransformation = (value: string, id: string) => {
    setTransforms(transform => transform.map(t => {
      if (t.id == id) {
        t.type = value
        return t;
      } else return t;
    }))
  }
  const removeTransform = (id: string) => {
    setTransforms(transform => transform.filter(t => t.id !== id))
  }

  return (<>
    {editTransformMode ?
      (<>
        <div className={'pb-1 px-3 flex gap-2'}>
          <Select
            value={transform.type}
            onValueChange={(e) => updateTransformation(e, transform.id)}
          >
            <SelectTrigger className="h-8">
              <SelectValue/>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {TransformationTypes.map(type => (
                  <SelectItem value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <div className="buttons">
            <IconTooltipButton title={'삭제'} clickEvent={() => removeTransform(transform.id)}>
              <Trash2 className="size-4"/>
            </IconTooltipButton>
          </div>
        </div>
        <div className="options">
          {transform.type === 'Mask' && (
            <div className={'px-5 py-2'}>
              <div className="text-sm mb-1">마스킹 자리수</div>
              <Input
                type="number"
                value={transform.value}
                onChange={(e) => updateTransformValue(e, transform.id)}
                className="h-7 w-full"
              />
            </div>
          )}
        </div>
      </>)
      : (<div className="py-2 px-5 rounded-lg min-w-16">
        <div className="text-sm">
          {transform?.type}
        </div>
        <p className="truncate text-sm">
          {transform?.value}
        </p>
      </div>)
    }
  </>)
}
