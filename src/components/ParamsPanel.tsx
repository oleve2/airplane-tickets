import { FC, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';

import cloneDeep from 'lodash.clonedeep';

// style
import '../styles/Main.scss';

// components
import CheckElement from './CheckElement';

//
import { RootState } from '../rtkstore/store';
import { actionsTicketReducer } from '../rtkstore/ticketReducer';
import { AppDispatch } from "../rtkstore/store";
import { filterTickets, calcCntStopsSelected } from '../rtkstore/ticketReducer';

interface ParamsPanelProps {}

//
const ParamsPanel:FC<ParamsPanelProps> = (props): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();

  // store
  const storecurrencies      = useSelector( (store: RootState) => store.ticketReducer.currencies);
  const storearrStopsSelect  = useSelector( (store: RootState) => store.ticketReducer.arrStopsSelect);

  const [currencySelected, setcurrencySelected]     = useState<string>('');
  const [stopsAllIsSelected, setstopsAllIsSelected] = useState<boolean>(true);

  //
  const handleSelect = (val: string): void => {
    setcurrencySelected(val);
  }

  //
  const clickSelect = (label: number): void => {
    let arrCopy = cloneDeep(storearrStopsSelect);
    // handle selection
    for (let i=0; i < arrCopy.length; i++) {
      if (arrCopy[i].label === label) {
        arrCopy[i].isSelected = !arrCopy[i].isSelected;
        break;
      }
    }
    // handle All
    if (calcCntStopsSelected(arrCopy) < arrCopy.length) {
      setstopsAllIsSelected(false);
    } else {
      setstopsAllIsSelected(true);
    }
    // set 
    dispatch( actionsTicketReducer.setarrStopsSelect(arrCopy) );
    dispatch(filterTickets({}));
  }

  //
  const clickAll = (): void => {
    let newVal: boolean = !stopsAllIsSelected;
    let arrCopy = cloneDeep(storearrStopsSelect);
    for (let i=0; i < arrCopy.length; i++) {
      arrCopy[i].isSelected = newVal;
    }
    setstopsAllIsSelected(newVal);
    dispatch( actionsTicketReducer.setarrStopsSelect(arrCopy) );
    dispatch(filterTickets({}));
  }

  // 
  const clickOnly = (label: number | string) => {
    let arrCopy = cloneDeep(storearrStopsSelect);
    //
    arrCopy = arrCopy.map( (elem) => {
      if (label === 'Все') {
        setstopsAllIsSelected(true);
        return { ...elem, isSelected: true }
      } else {
        setstopsAllIsSelected(false);
        if (elem.label === label) {
          return { ...elem, isSelected: true }
        } else {
          return { ...elem, isSelected: false }
        }        
      }
    })
    dispatch( actionsTicketReducer.setarrStopsSelect(arrCopy) );
    dispatch(filterTickets({}));
  }

  //
  return (
    <div>
      <div className="params-block">
        <div className="params__logo">Валюта</div> 

        <div className="params__currList">
          { storecurrencies.map( (item) => {
            return <div key={item} 
              className={ (item === currencySelected) ? "params__divCurrency_selected" : "params__divCurrency"}
              onClick={() => { handleSelect(item) }}
            > 
              {item}
            </div>
          }) }
        </div>
      </div>
    
      <div className="params-block">
        <div className="params__logo">Количество пересадок</div>
        <div>
          <CheckElement   
            label='Все'
            isChecked={stopsAllIsSelected}
            handleClick={clickAll}
            handleOnlyDiv={clickOnly}
          />
          
          { storearrStopsSelect.map( (item) => {
            return <div key={item.label}>
              <CheckElement 
                label={item.label}
                isChecked={item.isSelected}
                handleClick={clickSelect}
                handleOnlyDiv={clickOnly}
              />
            </div>
          }) }
        </div>
      </div>
    </div>
  )
}

export default ParamsPanel;
