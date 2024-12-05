import PropTypes from "prop-types";
import { formatTime } from "../../../../utils/utils";

const StateInfo = ({ order }) => {

  const stateInfo = {
    pending: () => (
      <span>
        {order.orderLog?.log}, được đặt bởi {order.orderLog?.performedBy} vào lúc {formatTime(order.orderDate)}.
      </span>
    ),
    awaitingPayment: () => (
      <span>
        {order.orderLog?.log}, được đặt bởi {order.orderLog?.performedBy} vào lúc {formatTime(order.orderLog?.time)}.
      </span>
    ),
    preparing: () => (
      <div className="flex gap-5">
        <span>
          {order.orderLog?.log} : {formatTime(order.orderLog?.time)}.
        </span>
        {
          order?.isPaid && <span className="bg-primary text-white rounded-md px-2">
            Đã thanh toán
          </span>
        }
      </div>
    ),
    shipping: () => (
     <div className="flex gap-5">
        <span>
          {order.orderLog?.log} : {formatTime(order.orderLog?.time)}.
        </span>
        {
          order?.isPaid && <span className="bg-primary text-white rounded-md px-2">
            Đã thanh toán
          </span>
        }
      </div>
    ),
    returned: () => (
      <div className="flex gap-5">
        <span>
          {order.orderLog?.log} : {formatTime(order.orderLog?.time)}.
        </span>
        {
          order?.isPaid && <span className="bg-primary text-white rounded-md px-2">
            Đã thanh toán
          </span>
        }
      </div>
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