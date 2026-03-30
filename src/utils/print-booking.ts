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
      font-family: Arial, sans-serif;
      width: 4in;
      height: 6in;
      display: flex;
      justify-content: center;
      align-items: flex-start;
    }

    .preview-card {
      width: 3.2in;
      padding-top: 0.4in;
      color: #000;
    }

    /* Header */
    .header {
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      margin-bottom: 14px;
    }

    .header img {
      width: 38px;
      height: 38px;
    }

    .header-center {
      text-align: center;
      line-height: 1.2;
    }

    .header-title {
      font-size: 16px;
      margin: 0;
      font-weight: normal;
    }

    .header-subtitle {
      font-size: 14px;
      margin: 0;
    }

    /* Issue date */
    .issue-date {
      font-size: 13px;
      margin-bottom: 12px;
    }

    /* Barcode */
    .barcode-section {
      text-align: center;
      margin-bottom: 18px;
    }

    .barcode-container {
      width: 100%;
      height: 48px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .barcode-text {
      font-size: 14px;
      margin-top: 6px;
      letter-spacing: 1px;
    }

    /* Address */
    .address-section {
      margin-bottom: 16px;
    }

    .address-title,
    .from-title {
      font-size: 14px;
      margin: 0 0 4px 0;
    }

    .address-text {
      font-size: 14px;
      margin: 2px 0;
      line-height: 1.3;
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
           <img src="/bpo.png" />

      <div class="header-center">
        <div class="header-title">BPO</div>
        <div class="header-subtitle">e-Passport Booking</div>
      </div>
             <img src="/passport.png" />

    </div>

    <div class="issue-date">
      Issue Date: ${getTodayDate()}
    </div>

    <div class="barcode-section">
      <div class="barcode-container">
        ${printContent.querySelector(".barcode-container")?.innerHTML || ""}
      </div>
      <div class="barcode-text">${barcodeInput}</div>
    </div>

    <div class="address-section">
      <div class="address-title">To</div>
      <div class="address-text">${selectedRPO.address}</div>
      <div class="address-text">Phone: ${selectedRPO.mobile}</div>
    </div>

    <div class="address-section">
      <div class="from-title">From</div>
      <div class="address-text">Passport Personalization Complex</div>
      <div class="address-text">Plot-4, Road-1, Sector-16(i), Diabari, Uttara</div>
      <div class="address-text">Dhaka-1711</div>
    </div>

  </div>

  <script>
    window.onload = () => {
      window.print();
      window.onafterprint = () => window.close();
    };
  </script>
</body>
</html>
`);
  printWindow.document.close();
};
