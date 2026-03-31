import { Chip } from "@heroui/react";
import { PassportBookingResponse } from "@/types/passport";
import { Copy } from "lucide-react";

interface Props {
  data: PassportBookingResponse;
  columnKey: string | React.Key;
  index: number;
  serial?: number;
  setSelectedRowData: React.Dispatch<
    React.SetStateAction<PassportBookingResponse | null>
  >;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const RenderCell = ({
  data,
  columnKey,
  index,
  serial = 0,
  setSelectedRowData,
  setIsOpen,
}: Props) => {
  const handleCopy = (text: string) => {
  navigator.clipboard.writeText(text);
};
  switch (columnKey) {
    case "serial_no":
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {serial + index + 1}
          </span>
        </div>
      );

    // case "date":
    //   return (
    //     <div className="flex flex-col">
    //       <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
    //         {data.booking_date || "-"}
    //       </span>
    //     </div>
    //   );
    case "date":
      let formatted = "-";

      if (data.booking_date) {
        const dateObj = new Date(data.booking_date.replace(" ", "T"));

        const datePart = dateObj.toLocaleDateString("en-US");

        const ampm = dateObj.getHours() >= 12 ? "PM" : "AM";

        formatted = `${datePart}, ${ampm}`;
      }

      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {formatted}
          </span>
        </div>
      );

    case "booking_id":
      return (
        <div className="flex  items-center gap-4">
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {data.item_id || "-"}
          </span>
           {data.item_id && (
        <Copy
          size={16}
          className="cursor-pointer text-gray-500 hover:text-blue-600"
          onClick={() => handleCopy(data.item_id)}
        />
      )}
        </div>
      );

    case "rpo_id":
      return (
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {data.post_code || "-"}
          </span>
           <Copy
          size={16}
          className="cursor-pointer text-gray-500 hover:text-blue-600"
          onClick={() => handleCopy(data.post_code)}
        />
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
      ): "success" | "danger" | "warning" | "default" => {
        switch (status.toLowerCase()) {
          case "parcel":
            return "danger";
          case "delivered":
            return "success";
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
    case "view":
      return (
        <div className="flex flex-col">
          <button
            onClick={() => {
              setSelectedRowData(data);
              setIsOpen(true);
            }}
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            View
          </button>
        </div>
      );
    default:
      return <p className="text-postDark dark:text-postLight text-sm">-</p>;
  }
};

export default RenderCell;
