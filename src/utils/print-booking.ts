// import { RegionalPassportOffice } from "./address-util";

interface PrintBookingParams {
  barcodeInput: string;
  selectedRPO: {
    address: string;
    mobile: string;
    code:string
  };
  getTodayDate: () => string;
}

export const printBookingPreview = ({
  barcodeInput,
  selectedRPO,
  getTodayDate,
}: PrintBookingParams): void => {

  
  const toTitleCase = (str: string) => {
    const addressFormate = str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return addressFormate;
  };

  const formattedAddress = toTitleCase(selectedRPO.address)
    .split(",")
    .join("<br/>");

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Print Booking - ${barcodeInput}</title>
   <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
  <style>
    @page {
      size: 4in 6in;
      margin: 0;
    }
       


     body {
      margin: 0;
     font-family: 'Open Sans', sans-serif;
       
      width: 4in;
      height: 6in;
      display: flex;
      justify-content: center;
      align-items: flex-start;
    }

    .print-card {
      width: 3.2in;
      padding-top: 0.4in;
      color: #000;
    }

    /* Header */
    .header {
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      margin-bottom: 24px;
      gap: 10px;
    }

    .header img {
      width: 45px;
      height: 45px;
    }

    .header-center {
      text-align: center;
      
      line-height: 1.2;
    }

    .header-title {
      font-size: 18px;
      margin: 0;
      font-weight: 500;
    }

    .header-subtitle {
      font-size: 16px;
      font-weight: 500;
      margin: 0;
    }

    /* Issue date */
    .issue-date {
      font-size: 13px;
      margin-top:15px;
      margin-left: 8px;
      margin-bottom: 3px;
       
    }

    /* Barcode */
    .barcode-section {
      text-align: center;
      margin-bottom: 20px;
    }

    .barcode-container {
      width: 100%;
      height: auto;
      display: flex;
      justify-content: start;
      align-items: center;
      
      
    }

    .barcode-text {
       mergin-top: -2px;
      font-size: 16px;
      font-weight: 500;
    }

    /* Address */
    .address-section {
      margin-bottom: 25px;
      margin-left: 6px;
      font-size: 15px;
       font-weight: semi-bold;
    }

    .address-title,
    .from-title {
      
    }

    .address-text {
      margin: 2px 0;
      
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
  <div class="print-card">

    <div class="header">
      <img src="/passport.png" alt="Passport" />
      <div class="header-center">
        <div class="header-title">BPO</div>
        <div class="header-subtitle">e-Passport Booking</div>
      </div>
      <img src="/bpo.png" alt="BPO" />
    </div>

    <div class="issue-date">
      Issue Date: ${getTodayDate()}
    </div>

    <div class="barcode-section">
      <div class="barcode-container">
        <svg id="barcode"></svg>
      </div>
      <div class="barcode-text">${barcodeInput}</div>
    </div>

    <div class="address-section">
      <div class="address-title">To</div>
        <div class="address-text"><div class="address-text">
          ${formattedAddress} ${selectedRPO.code}
        </div>
      </div>
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
  const cleanupIframe = () => {
    // Signal to parent to remove iframe
    window.top?.postMessage({ type: 'print-complete' }, '*');
  };

  window.onafterprint = cleanupIframe;
  
  window.onload = () => {
    // Generate barcode
    JsBarcode("#barcode", "${barcodeInput}", {
      format: "CODE39",
      width: 1.2,
      height: 45,
      displayValue: false
    });
    
    // Trigger print immediately after barcode renders
    setTimeout(() => {
      window.print();
    }, 100);
  };
</script>
</body>
</html>
`;

  // Create a hidden iframe
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  document.body.appendChild(iframe);

  // Write content to iframe
  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
  if (iframeDoc) {
    iframeDoc.open();
    iframeDoc.write(htmlContent);
    iframeDoc.close();

    // Clean up iframe after print dialog closes (with delay to account for print dialog duration)
    setTimeout(() => {
      try {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      } catch (error) {
        // Silently fail if iframe is already removed
        console.log(error);
      }
    }, 3000);
  }
};