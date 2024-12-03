import PropTypes from "prop-types";
import { formatTime } from "../../../../utils/utils";

const StateInfo = ({ order }) => {

  const stateInfo = {
    pending: () => (
      <span>
        {order.orderLog?.log} bởi {order.orderLog?.performedBy} vào lúc {formatTime(order.orderDate)}.
      </span>
    ),
    awaitingPayment: () => (
      <span>
        {order.orderLog?.log}, được đặt bởi {order.orderLog?.performedBy} vào lúc {formatTime(order.orderLog?.time)}.
      </span>
    ),
    preparing: () => (
      <span>
        {order.orderLog?.log} : {formatTime(order.orderLog?.time)}.
      </span>
    ),
    shipping: () => (
      <span>
        {order.orderLog?.log} : {formatTime(order.orderLog?.time)}.
      </span>
    ),
    returned: () => (
      <span>
        {order.orderLog?.log} : {formatTime(order.orderLog?.time)}.
      </span>
    ),
    refunded: () => (
      <span>
        {order.orderLog?.log} : {formatTime(order.orderLog?.time)}.
      </span>
    ),
  };

  return stateInfo[order.state] ? stateInfo[order.state]() : null;
};

export default StateInfo;


StateInfo.propTypes = {
  order: PropTypes.object.isRequired,
}