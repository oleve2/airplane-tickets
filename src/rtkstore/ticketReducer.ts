import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

//import cloneDeep from 'lodash.clonedeep';
import ticketData from '../data/tickets.json';
import { parse } from 'date-fns';

// models
import { TicketModel, ArrStopsChange } from "../models/models";
import { RootState } from './store';


interface TicketState {
  currencies: string[],
  tickets: TicketModel[],
  ticketsFiltered: TicketModel[],
  arrStopsSelect: ArrStopsChange[],
}


const initialState: TicketState = {
  currencies: ['RUB', 'USD', 'EUR'],
  tickets: [],
  ticketsFiltered: [],
  arrStopsSelect: [],
}

const ticketReducer = createSlice({
  name: 'ticketReducer',
  initialState: initialState,
  reducers: {
    setTickets(state, action: PayloadAction<TicketModel[]>) {
      state.tickets = action.payload;
    },
    setarrStopsSelect(state, action: PayloadAction<ArrStopsChange[]>) {
      state.arrStopsSelect = action.payload;
    },
    setticketsFiltered(state, action: PayloadAction<TicketModel[]>) {
      state.ticketsFiltered = action.payload;
    },    
  }
})

export const actionsTicketReducer = ticketReducer.actions;
export default ticketReducer.reducer;


// ----------------------------------------
export const initData2 = createAsyncThunk(
  'data/init',
  async (obj: Object, thunkAPI) => {
    let ticketsSorted: TicketModel[] = [...ticketData.tickets];
    ticketsSorted = ticketsSorted.sort( (a:TicketModel, b:TicketModel) => {
      if (a.price > b.price) {return 1}
      if (a.price < b.price) {return -1}
      return 0;
    });
    thunkAPI.dispatch(actionsTicketReducer.setTickets(ticketsSorted));
    thunkAPI.dispatch(actionsTicketReducer.setticketsFiltered(ticketsSorted));
    
    let stops = getDistStops(ticketData.tickets);
  
    let arrStops: ArrStopsChange[] = [];
    for (let i=0; i < stops.length; i++) {
      let t: ArrStopsChange = {label: stops[i], isSelected: false}
      arrStops.push(t);
    }
    thunkAPI.dispatch(actionsTicketReducer.setarrStopsSelect(arrStops));    
  }
)

export const filterTickets = createAsyncThunk(
  'tickets/filter',
  async (obj: Object, thunkAPI) => {
    const appState = thunkAPI.getState() as RootState;
    let arrStopsSelect = appState.ticketReducer.arrStopsSelect;
    let tickets =  appState.ticketReducer.tickets;
    let ticketsF: TicketModel[] = makeTicketFiltered(arrStopsSelect, tickets);
    thunkAPI.dispatch( actionsTicketReducer.setticketsFiltered(ticketsF) )
  }
)

const makeTicketFiltered = (arr: ArrStopsChange[], tickets: TicketModel[]): TicketModel[] => {
  let ticksF: TicketModel[] = [];
  for (let i=0; i < tickets.length; i++) {
    let flgFound: boolean = false;
    for (let j=0; j < arr.length; j++) {
      if ((tickets[i].stops === arr[j].label) && (arr[j].isSelected === true)) {
        flgFound = true;
        break;
      }
    }
    if (flgFound === true) {
      ticksF.push(tickets[i]);
    }
  }
  //
  return ticksF;
}


// support functions  ------------------------------------------

export const getDistStops = (arr : TicketModel[]): number[] => {
  let arrRes: number[] = [];
  for (let i=0; i < arr.length; i++) {
    if (!arrRes.includes(arr[i].stops)) {
      arrRes.push(arr[i].stops);
    }
  }
  arrRes = arrRes.sort();
  return arrRes;
}


export const calcCntStopsSelected = (arr: ArrStopsChange[]): number => {
  let ttl: number = 0;
  for (let i=0; i < arr.length; i++) {
    if (arr[i].isSelected) { 
      ttl += 1 
    }
  }
  return ttl;
}

type mapMonthModel = Record<number, string>
type mapDayWeekModel = Record<number, string>

const mapMonth: mapMonthModel = {
  0: 'янв', 1: 'фев', 2: 'мар', 3: 'апр',
  4: 'май', 5: 'июн', 6: 'июль', 7: 'авг',
  8: 'сент', 9: 'окт', 10: 'ноя', 11: 'дек'
}
const mapDayWeek: mapDayWeekModel = {
  1:'Пн', 2:'Вт', 3:'Ср', 4:'Чтв', 
  5:'Птн', 6:'Суб', 0:'Вскр'
}
export const formatDate = (val: string) => {
  let d2 = parse(val, 'dd.MM.yy', new Date());
  let m: number = d2.getMonth();
  return `${d2.getDate()} ${mapMonth[m]} ${d2.getFullYear()}, ${mapDayWeek[d2.getDay()]}`
}

