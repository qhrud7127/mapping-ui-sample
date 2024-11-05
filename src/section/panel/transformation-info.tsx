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

  const updateTransformOptions = (value: ChangeEvent<HTMLInputElement>, id: string, key: string) => {
    setTransforms((transforms: Transformation[]) => transforms.map((t: Transformation) => {
      if (t.id == id) {
        t.options = {...t.options, [key]: value.target.value};
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

  return (
    <>
      {editTransformMode ?
        (<div className={""}>
          <div className={'pb-1 flex gap-2 items-center'}>
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
          <div className="options my-2 mx-10">
            {transform.type === 'Mask' && (
              <div className={'flex gap-2'}>
                <div className="text-sm w-1/4">마스킹 자리수</div>
                <Input
                  type="number"
                  value={transform.options?.number}
                  onChange={(e) => updateTransformOptions(e, transform.id, 'number')}
                  className="h-7"
                />
              </div>
            )}
            {transform.type === 'Prefix' && (
              <div className={'flex gap-2'}>
                <div className="text-sm w-1/4">Prefix</div>
                <Input
                  type="text"
                  value={transform.options?.prefix}
                  onChange={(e) => updateTransformOptions(e, transform.id, 'prefix')}
                  className="h-7"
                />
              </div>
            )}
            {transform.type === 'Append' && (
              <div className={'flex gap-2'}>
                <div className="text-sm w-1/4">Text</div>
                <Input
                  type="text"
                  value={transform.options?.text}
                  onChange={(e) => updateTransformOptions(e, transform.id, 'text')}
                  className="h-7"
                />
              </div>
            )}
            {transform.type === 'SubString' && (<>
                <div className={'flex gap-2 pb-2'}>
                  <div className="text-sm w-1/4">Start Index</div>
                  <Input
                    type="number"
                    value={transform.options?.start}
                    onChange={(e) => updateTransformOptions(e, transform.id, 'start')}
                    className="h-7"
                  />
                </div>
                <div className={'flex gap-2'}>
                  <div className="text-sm w-1/4">End Index</div>
                  <Input
                    type="number"
                    value={transform.options?.end}
                    onChange={(e) => updateTransformOptions(e, transform.id, 'end')}
                    className="h-7"
                  />
                </div>
              </>
            )}
          </div>
        </div>)
        : (
          <div className="py-2 min-w-16 text-sm">
            <div className="text-sm font-bold">
              {transform?.type}
            </div>
            <div className={'my-2 mx-10'}>
              {transform.type === 'Mask' && (
                <div className={'flex gap-4'}>
                  <div>마스킹 자리수</div>
                  <div>{transform.options?.number}</div>
                </div>
              )}
              {transform.type === 'Prefix' && (
                <div className={'flex gap-4'}>
                  <div>Prefix</div>
                  <div>{transform.options?.prefix}</div>
                </div>
              )}
              {transform.type === 'Append' && (
                <div className={'flex gap-4 pb-2'}>
                  <div>Text</div>
                  <div>{transform.options?.text}</div>
                </div>
              )}
              {transform.type === 'SubString' && (
                <>
                  <div className={'flex gap-4 pb-2'}>
                    <div>Start Index</div>
                    <div>{transform.options?.start}</div>
                  </div>
                  <div className={'flex gap-4'}>
                    <div>End Index</div>
                    <div>{transform.options?.end}</div>
                  </div>
                </>
              )}
            </div>
          </div>)
      }
    </>)
}
