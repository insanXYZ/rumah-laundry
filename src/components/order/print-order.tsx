import { ListOrder } from "@/app/dto/order-dto";
import { ConvertRupiah, formatToLocalTimezone } from "@/utils/utils";
import { Icon } from "@iconify/react";
import jsPDF from "jspdf";

export function PrintOrderButton({ values }: { values: ListOrder }) {
  const total = values.order_items.reduce(
    (sum, item) => sum + item.total_price,
    0
  );

  const generatePDF = async () => {
    const { default: jsPDF } = await import("jspdf");

    const width = 58;
    const font = "courier";
    const fontSize = 7;
    const leftMargin = 3;
    const contentWidth = width - leftMargin * 2;
    const marginBottom = 10;

    const addCenterText = (doc: any, text: string, yPos: number) => {
      doc.setFontSize(fontSize);
      const textWidth = doc.getTextWidth(text);
      const x = (width - textWidth) / 2;
      doc.text(text, x, yPos);
    };

    const addWrappedText = (
      doc: any,
      text: string,
      yPos: number,
      maxWidth = contentWidth,
      align = "center"
    ) => {
      doc.setFontSize(fontSize);
      const lines: string[] = doc.splitTextToSize(text, maxWidth) as string[];
      lines.forEach((line: string, index: number) => {
        if (align === "center") {
          const textWidth = doc.getTextWidth(line);
          const x = (width - textWidth) / 2;
          doc.text(line, x, yPos + index * 4);
        } else {
          doc.text(line, leftMargin, yPos + index * 4);
        }
      });
      return lines.length * 4;
    };

    const addLeftText = (doc: any, text: string, yPos: number) => {
      doc.setFontSize(fontSize);
      doc.text(text, leftMargin, yPos);
    };

    const addDashedLine = (doc: any, yPos: number) => {
      const dashLength = 1;
      const gapLength = 1;
      let x = leftMargin;
      while (x < width - leftMargin) {
        doc.line(x, yPos, x + dashLength, yPos);
        x += dashLength + gapLength;
      }
    };

    const convertSVGtoBase64 = async (svgPath: string) => {
      try {
        const response = await fetch(svgPath);
        const svgText = await response.text();
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;
        const img = new Image();
        return await new Promise<string | null>((resolve, reject) => {
          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL("image/png"));
          };
          img.onerror = () => resolve(null);
          img.src =
            "data:image/svg+xml;base64," +
            btoa(unescape(encodeURIComponent(svgText)));
        });
      } catch (error) {
        console.error("Error loading logo:", error);
        return null;
      }
    };

    const logoBase64 = await convertSVGtoBase64("/logo-small.svg");

    const renderContent = (
      doc: jsPDF,
      values: ListOrder,
      doDrawImages = true
    ) => {
      let y = 5;

      if (logoBase64 && doDrawImages) {
        const logoWidth = 20;
        const logoHeight = 15;
        const logoX = (width - logoWidth) / 2;
        doc.addImage(logoBase64, "PNG", logoX, y, logoWidth, logoHeight);
        y += logoHeight + 3;
      } else if (!logoBase64 && doDrawImages) {
        doc.setFont(font, "bold");
        addCenterText(doc, "Rumah Laundry", y);
        y += 5;
      } else {
        if (logoBase64) {
          const logoHeight = 15;
          y += logoHeight + 3;
        } else {
          y += 5;
        }
      }

      doc.setFont(font, "normal");

      const addressHeight = addWrappedText(
        doc,
        "Perum Citra Graha Residence Blok K.09, Sukasukur, Cisayong, Kab. Tasikmalaya",
        y
      );
      y += addressHeight;
      addCenterText(doc, "089517387808", y);
      y += 6;

      addDashedLine(doc, y);
      y += 5;

      doc.setFont(font, "normal");
      addLeftText(doc, `No: ${values.id}`, y);
      y += 4;
      addLeftText(
        doc,
        `Tanggal: ${formatToLocalTimezone(values.created_at)}`,
        y
      );
      y += 4;
      addLeftText(doc, `Pelanggan: ${values.name}`, y);
      y += 4;

      addDashedLine(doc, y);
      y += 5;

      values.order_items.forEach((item: any) => {
        addLeftText(doc, item.product_name!, y);
        y += 4;

        const qtyText = `${item.quantity} x ${ConvertRupiah(item.price)}`;
        const subtotal = ConvertRupiah(item.total_price);

        doc.setFontSize(6);
        doc.text(qtyText, leftMargin + 2, y);

        const subtotalWidth = doc.getTextWidth(subtotal);
        doc.text(subtotal, width - leftMargin - subtotalWidth, y);
        y += 5;
      });

      addDashedLine(doc, y);
      y += 5;

      doc.setFont(font, "normal");
      doc.text("Total :", leftMargin, y);
      const totalText = ConvertRupiah(total);
      const totalWidth = doc.getTextWidth(totalText);
      doc.text(totalText, width - leftMargin - totalWidth, y);
      y += 6;

      addDashedLine(doc, y);
      y += 5;

      doc.setFont(font, "normal");
      addCenterText(doc, "Terima Kasih", y);
      y += 4;

      return y;
    };

    const tempDoc = new jsPDF({ unit: "mm", format: [width, 200] });
    tempDoc.setFont(font, "normal");
    tempDoc.setFontSize(fontSize);
    const measuredY = renderContent(tempDoc, values, false);
    const finalHeight = Math.max(measuredY + marginBottom, 30);

    const doc = new jsPDF({
      unit: "mm",
      format: [width, finalHeight],
    });
    doc.setFont(font, "normal");
    doc.setFontSize(fontSize);
    renderContent(doc, values, true);

    doc.save(`nota-${values.id}.pdf`);
  };

  return (
    <>
      <Icon color="black" onClick={generatePDF} icon={"lucide:printer"} />
    </>
  );
}
