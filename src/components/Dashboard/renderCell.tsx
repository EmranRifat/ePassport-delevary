import { Chip } from "@heroui/react";
import { PassportBookingResponse } from "@/types/passport";

interface Props {
  data: PassportBookingResponse;
  columnKey: string | React.Key;
  index: number;
  serial?: number;
}
const RenderCell = ({ data, columnKey, index, serial = 0 }: Props) => {
  switch (columnKey) {
    case "serial_no":
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {serial + index + 1}
          </span>
        </div>
      );

    case "date":
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {data.booking_date || "-"}
          </span>
        </div>
      );

    case "booking_id":
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {data.item_id || "-"}
          </span>
        </div>
      );

    case "rpo_id":
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {data.post_code || "-"}
          </span>
        </div>
      );

    case "rpo_name":
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {data.rpo_name || "-"}
          </span>
        </div>
      );
    case "service_type":
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {data.service_type || "-"}
          </span>
        </div>
      );
    case "rpo_address":
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {data.rpo_address || "-"}
          </span>
        </div>
      );

    case "status":
      const status = data.booking_status || "-";
      const getStatusColor = (
        status: string,
      ): "success" | "danger" | "warning" | "default" => {
        switch (status.toLowerCase()) {
          case "booked":
            return "warning";
          case "delivered":
            return "success";
          default:
            return "default";
        }
      };

      return (
        <Chip
          color={getStatusColor(status)}
          variant="flat"
          size="sm"
          className="font-medium"
        >
          {status}
        </Chip>
      );
    default:
      return <p className="text-postDark dark:text-postLight text-sm">-</p>;
  }
};

export default RenderCell;
