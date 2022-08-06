import { FC } from "react";

import { TicketModel } from '../models/models';
import { formatDate } from '../rtkstore/ticketReducer';

// images
import '../styles/Main.scss';
import turair from '../assets/turair.png';
import plane_ticket from '../assets/plane_ticket.png';


interface TicketProps {
  t: TicketModel,
}

const Ticket:FC<TicketProps> = (props): JSX.Element => {
  //
  return (
    <div className="ticket_wrapper">
      <div className="ticket_header">
        <img className="ticket_header__img" src={turair} alt="turkish airlines" />

        <div className="ticket_header__buyBtn">
          <div>Купить</div>
          <div>за {props.t.price} р</div>
        </div>
      </div>

      <div className="ticket_body">
        <div className="ticket_body__block_L">
          <div className="ticket_body__time">{props.t.departure_time}</div>
          <div className="ticket_body__city">{props.t.origin} {props.t.origin_name}</div>
          <div className="ticket_body__date">{formatDate(props.t.departure_date)}</div>
        </div>

        <div className="ticket_body__block_M">
          <div className="tb__stops">{props.t.stops} пересадок</div>
          <div className="tb__imgwrapper">
            <div className="tb__line"></div> 
            <img className="tb__plane" src={plane_ticket} alt="plane" />
          </div>
        </div>

        <div className="ticket_body__block_R">
          <div className="ticket_body__time">{props.t.arrival_time}</div>
          <div className="ticket_body__city">{props.t.destination_name} {props.t.destination}</div>
          <div className="ticket_body__date">{formatDate(props.t.arrival_date)}</div>
        </div>
      </div>
    </div>
  )
}

export default Ticket;
