import { RegionalPassportOffice } from "./address-util";

interface PrintBookingParams {
    barcodeInput: string;
    selectedRPO: RegionalPassportOffice;
    getTodayDate: () => string;
}

export const printBookingPreview = ({
    barcodeInput,
    selectedRPO,
    getTodayDate,
}: PrintBookingParams): void => {
    const printContent = document.getElementById("booking-preview-card");
    if (!printContent) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Print Booking - ${barcodeInput}</title>
        <style>
          @page {
            size: 4in 6in;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 35px 5px 0 5px;
            font-family: Arial, sans-serif;
            width: 4in;
            height: 6in;
          }
          .preview-card {
            width: 230px;
            margin: 0 auto;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }
          .header img {
            width: 35px;
            height: 35px;
          }
          .header-center {
            text-align: center;
          }
          .header-title {
            font-size: 13px;
            font-weight: normal;
            color: black;
            margin: 0;
          }
          .header-subtitle {
            font-size: 12px;
            color: black;
            margin: 0;
          }
          .issue-date {
            text-align: left;
            font-size: 10px;
            color: #111827;
            margin-bottom: 10px;
          }
          .barcode-section {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 20px;
          }
          .barcode-container {
            height: 35px;
            width: 225px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .barcode-text {
            font-size: 12px;
            color: #000;
            margin-top: 5px;
          }
          .address-section {
            width: 100%;
            margin-bottom: 20px;
          }
          .address-title {
            font-size: 12px;
            font-weight: normal;
            color: #000;
            margin: 0 0 2px 0;
          }
          .address-text {
            font-size: 12px;
            font-weight: normal;
            color: #000;
            margin: 2px 0;
          }
          .from-title {
            font-size: 12px;
            font-weight: normal;
            color: #000;
            margin: 0 0 2px 0;
          }
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <div class="preview-card">
          <div class="header">
            <img src="/bpo.png" alt="BPO" />
            <div class="header-center">
              <h2 class="header-title">BPO</h2>
              <p class="header-subtitle">e-Passport Booking</p>
            </div>
            <img src="/passport.png" alt="Passport" />
          </div>
          
          <div class="issue-date">Issue Date : ${getTodayDate()}</div>
          
          <div class="barcode-section">
            <div class="barcode-container">
              ${printContent.querySelector(".barcode-container")?.innerHTML ||
        ""
        }
            </div>
            <p class="barcode-text">${barcodeInput}</p>
          </div>
          
          <div class="address-section">
            <p class="address-title">To</p>
            <p class="address-text">${selectedRPO.address}</p>
            <p class="address-text">Phone: ${selectedRPO.mobile}</p>
          </div>
          
          <div class="address-section">
            <p class="from-title">From</p>
            <p class="address-text">Passport Personalization Complex</p>
            <p class="address-text">Plot-4, Road-1, Sector-16(i), Diabari, Uttara</p>
            <p class="address-text">Dhaka-1711</p>
          </div>
        </div>
        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            };
          };
        </script>
      </body>
    </html>
  `);
    printWindow.document.close();
};
