import { FC, useState } from "react";

interface CheckElementProps {
  label: number | string,
  isChecked: boolean,
  handleClick(label: number | string): void,
  handleOnlyDiv(label: number | string): void,
}


const CheckElement: FC<CheckElementProps> = (props): JSX.Element => {
  const [showOnly, setshowOnly] = useState(false);
  //
  const calcLabel = (label: number | string): string => {
    if (label === 0) {
      return 'Без пересадок'
    } else if (label === 'Все') {
      return label;
    } else {
      return `${label} пересадок`;
    }
  }

  //
  const doEnter = () => {
    setshowOnly(true);
  }

  //
  const doLeave = () => {
    setshowOnly(false);
  }

  //
  return (
    <div className="checkElem_wrapper"
      onMouseEnter={doEnter}
      onMouseLeave={doLeave}
    >
      <div className="checkElem__head">
        <input className="checkElem__checkbox" type="checkbox"
          checked={props.isChecked} 
          onChange={() => { props.handleClick(props.label) }}
        />

        <label className="checkElem__label">{calcLabel(props.label)}</label>
      </div>

      { showOnly &&  
        <div className="checkElem__tail" onClick={() => { props.handleOnlyDiv(props.label) }}>
          только
        </div>
      }
    </div>
  )
}

export default CheckElement;
