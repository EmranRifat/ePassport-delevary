import { Chip } from "@heroui/react";
import { PassportBookingResponse } from "@/types/passport";

interface Props {
  data: PassportBookingResponse;
  columnKey: string | React.Key;
  index: number;
  serial?: number;
  copiedKey: string | null;
  handleCopy: (text: string, key: string) => void;
}
const RenderCell = ({
  data,
  columnKey,
  index,
  serial = 0,
  copiedKey,
  handleCopy,
}: Props) => {
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
      let formatted = "-";

      if (data.booking_date) {
        const dateObj = new Date(data.booking_date.replace(" ", "T"));

        // Date part
        const datePart = dateObj.toLocaleDateString("en-US");
        let hours = dateObj.getHours();
        const minutes = dateObj.getMinutes().toString().padStart(2, "0");
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
        const timePart = `${hours}:${minutes} ${ampm}`;
        formatted = `${datePart} ${timePart}`;
      }

      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {" "}
            {formatted || "-"}{" "}
          </span>
        </div>
      );

    case "booking_id":
      return (
        <div className="relative flex items-center justify-start group">
          {/* Tooltip */}
          {data.item_id && (
            <span
              className={`
            absolute -top-8 left-12 -translate-x-1/2
            text-[11px] px-1 py-0.5 rounded-md shadow-md
            opacity-0 scale-90
            group-hover:opacity-100 group-hover:scale-100
            transition-all duration-100
            whitespace-nowrap
            ${copiedKey === `booking-${index}` ? "bg-green-100 text-green-600" : "bg-gray-50 text-gray-700"}
          `}
              onClick={(e) => {
                e.stopPropagation();
                handleCopy(data?.item_id, `booking-${index}`);
              }}
            >
              {copiedKey === `booking-${index}` ? "Copied" : "Copy"}
            </span>
          )}

          {/* Arrow */}
          {data.item_id && (
            <span
              className={`
            absolute -top-2 left-1/2 -translate-x-1/2
            w-2 h-2 rotate-45
            transition
            opacity-0 group-hover:opacity-100
          `}
            />
          )}

          {/* Main Text */}
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {data.item_id || "-"}
          </span>
        </div>
      );

    case "rpo_id":
      return (
        <div className="relative flex items-center justify-start group">
          {/* Tooltip */}
          {data.item_id && (
            <span
              className={`absolute -top-8 left-6 -translate-x-1/2
            bg-gray-50 text-gray-700 text-[11px]
            px-1 py-0.5 rounded-md shadow-md
            opacity-0 scale-90
            group-hover:opacity-100 group-hover:scale-100
            transition-all duration-200
             whitespace-nowrap
             ${copiedKey === `rpo-${index}` ? "bg-green-100 text-green-600" : "bg-gray-50 text-gray-700"}
           `}
              onClick={(e) => {
                e.stopPropagation();
                handleCopy(data?.item_id, `rpo-${index}`);
              }}
            >
              {copiedKey === `rpo-${index}` ? "Copied" : "Copy"}
            </span>
          )}

          {/* Arrow */}
          {data.item_id && (
            <span
              className="
            absolute -top-2 left-1/2 -translate-x-1/2
            w-2 h-2 rotate-45
            opacity-0 group-hover:opacity-100 transition
          "
            />
          )}

          {/* Main Text */}
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200 ">
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
      const service_type = data.service_type || "-";
      const getServiceTypeColor = (
        status: string,
      ): "success" | "secondary" | "danger" | "warning" | "default" => {
        switch (status.toLowerCase()) {
          case "parcel":
            return "secondary";
          default:
            return "default";
        }
      };

      return (
        <Chip
          color={getServiceTypeColor(service_type)}
          variant="flat"
          size="sm"
          className="font-medium"
        >
          {service_type}
        </Chip>
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
      ): "primary" | "success" | "danger" | "warning" | "default" => {
        switch (status.toLowerCase()) {
          case "booked":
            return "primary";
          case "delivered":
            return "success";
          case "pending":
            return "warning";
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
