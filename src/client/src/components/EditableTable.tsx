import { useState } from "react";

export enum InputTypes {
  text,
  number,
  image,
  select
}

export interface ISelectItem {
  id: number,
  title: string
}

export interface IEditableTableProps {
  columnsTitle: Array<string>,
  columnsIds: Array<string>,
  inputTypes: Array<InputTypes | null>,
  selectItems: Array<Array<ISelectItem> | null>
  values: Array<Array<string | number>>
  sourceObjs: Array<any>,
  canDisable: boolean,
  updateItemCallback: (sourceObj: object, form: Map<string, string | number>) => void
}

export function EditableTable(props: IEditableTableProps) {
  const [ editableRow, setEditableRow ] = useState<null | number>(null);
  const [ form, setForm ] = useState<Map<string, string | number>>(new Map());
  const changeHandler = (event: React.FormEvent<HTMLSelectElement | HTMLInputElement>) => {
    if (event.currentTarget == null){
      return;
    }
    const key = event.currentTarget.name;
    const value = event.currentTarget.value;
    setForm((previousForm) => previousForm.set(key, value));
  }

  const getValueElement = (rowIndex: number, valueIndex: number) => {
    if (rowIndex === editableRow) {
      const inputType = props.inputTypes[valueIndex];
      const className = 'form-control form-control-sm';
      const propertyId = props.columnsIds[valueIndex];
      if (inputType === InputTypes.image){
        return (
          <td key={`${rowIndex}-${valueIndex}`}>
            <input className={className} name={propertyId} onChange={changeHandler} type="file" accept="image/png, image/gif, image/jpeg" />
          </td>
        )
      }

      if (inputType === InputTypes.select) {
        const selectItems = props.selectItems[valueIndex] ?? [];
        return (
          <td key={`${rowIndex}-${valueIndex}`}>
            <select className="form-control form-control-sm" name={propertyId} defaultValue={selectItems[0].id} onChange={changeHandler}>
              {
                selectItems.map((s, i) => {
                  return (
                    <option value={s.id} key={`${s.id}-${i}`}>{s.title}</option>
                  )
                })
              }
            </select>
          </td>
        )
      }

      const inputTypeHtml = inputType === InputTypes.number ? 'number' : 'text';
      const defaultValue = props.values[rowIndex][valueIndex];
      const disabled = props.inputTypes[valueIndex] == null;
      return (
        <td key={`${rowIndex}-${valueIndex}`}>
          <input className={className} name={propertyId} onChange={changeHandler} disabled={disabled} type={inputTypeHtml}  defaultValue={defaultValue} />
        </td>
      )
    }

    return (
      <td key={`${rowIndex}-${valueIndex}`}>{props.values[rowIndex][valueIndex]}</td>
    )
  }

  const onEditHanler = (rowIndex: number) => {
    setEditableRow(rowIndex);
  }

  const onSaveHandler = (rowIndex: number) => {
    props.updateItemCallback(props.sourceObjs[rowIndex], form);
    setEditableRow(null);
    setForm(new Map());
  }

  const onCancelHandler = () => {
    setEditableRow(null);
    setForm(new Map());
  }

  return (
    <div className="container-fluid">
      <div className="row">
          <div className="col-12">
              <div className="card">
                  <div className="card-body">
                      <div className="table-responsive">
                          <table className="table table-editable table-nowrap align-middle table-edits">
                              <thead>
                                  <tr style={{cursor: 'pointer'}}>
                                      {props.columnsTitle.map((title, i) => {
                                        return (
                                          <th key={i}>{title}</th>
                                        )
                                      })}
                                      <th key="edit">Действия</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  {props.values.map((v, i) => {
                                    return (
                                      <tr key={i} style={{cursor: 'pointer'}}>
                                        {v.map((d, j) => {
                                          return getValueElement(i, j)
                                        })}
                                        <td>
                                          {editableRow === i && <button className="btn btn-link btn-sm" onClick={() => onSaveHandler(i)}>Сохранить</button>}
                                          {editableRow !== i && <button className="btn btn-link btn-sm" disabled={editableRow != null} onClick={() => onEditHanler(i)}>Изменить</button>}
                                          {props.canDisable && editableRow !== i && <button className="btn btn-link btn-sm" disabled={editableRow != null}>Отключить</button>}
                                          {editableRow === i && <button className="btn btn-link btn-sm" onClick={onCancelHandler}>Отменить</button>}
                                        </td>
                                      </tr>)
                                  })}                                  
                              </tbody>
                          </table>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  )
}