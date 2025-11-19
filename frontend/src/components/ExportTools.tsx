import jsPDF from 'jspdf';
import Konva from 'konva';
import { useStoryboardStore } from '../store/storyboardStore';

export default function ExportTools() {
  const { currentProject } = useStoryboardStore();

  const handleExportPNG = () => {
    try {
      const stage = Konva.stages[0];
      if (!stage) {
        alert('Canvas not found');
        return;
      }

      const dataURL = stage.toDataURL({
        pixelRatio: 2,
        mimeType: 'image/png',
        quality: 1,
      });

      const link = document.createElement('a');
      link.download = `${currentProject?.title || 'storyboard'}-${Date.now()}.png`;
      link.href = dataURL;
      link.click();
    } catch (error) {
      console.error('Error exporting PNG:', error);
      alert('Failed to export PNG');
    }
  };

  const handleExportPDF = async () => {
    try {
      const stage = Konva.stages[0];
      if (!stage) {
        alert('Canvas not found');
        return;
      }

      const dataURL = stage.toDataURL({
        pixelRatio: 2,
        mimeType: 'image/png',
        quality: 1,
      });

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [stage.width(), stage.height()],
      });

      pdf.addImage(dataURL, 'PNG', 0, 0, stage.width(), stage.height());
      pdf.save(`${currentProject?.title || 'storyboard'}-${Date.now()}.pdf`);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF');
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleExportPNG}
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
      >
        Export PNG
      </button>
      <button
        onClick={handleExportPDF}
        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
      >
        Export PDF
      </button>
    </div>
  );
}

