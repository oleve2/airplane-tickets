import React, { FC, useEffect } from 'react';

import Ticket from './components/Ticket';
import ParamsPanel from './components/ParamsPanel';
import planeImg from './assets/plane.png';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './rtkstore/store';
import { initData2 } from './rtkstore/ticketReducer';
import { AppDispatch } from './rtkstore/store';

// styles
import './styles/Main.scss';

//
const App: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  // store
  const storeticketsFiltered    = useSelector( (store: RootState) => store.ticketReducer.ticketsFiltered);
 
  useEffect( () => {
    dispatch( initData2({}) );
  },[dispatch])

  return (<>
    {storeticketsFiltered && 
    <div className='main'>
      <div className='main_wrapper'>
      <div className='main_header'>
        <img className='main__img' src={planeImg} alt="img-plane" />
      </div>

      <div className='main__body'>
        <div className='main__params'>
          <ParamsPanel />
        </div>

        <div className='main__tickets'>
          { storeticketsFiltered.map( (ticket, index) => {
            return <Ticket key={index} t={ticket}/>
          }) }
        </div>      
      </div>
    </div>    
  </div>
    }
    </>
  );
}

export default App;
