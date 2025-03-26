import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";

// Define the itinerary type
interface ItineraryActivity {
  time: string;
  title: string;
  description: string;
  location: string;
  type: string;
  cost?: number;
  notes?: string;
}

interface ItineraryDay {
  date: string;
  activities: ItineraryActivity[];
}

interface Itinerary {
  id: string;
  title: string;
  description: string;
  destination: string;
  duration: number;
  startDate: string;
  totalCost: number;
  days: ItineraryDay[];
  preferences?: {
    interests: string[];
    budget: number;
  };
  tags?: string[];
}

// Function to generate PDF from itinerary data
export const generateItineraryPDF = (itinerary: Itinerary): string => {
  try {
    // Create a new PDF document
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 128); // Dark blue
    doc.text(itinerary.title, 105, 20, { align: "center" });

    // Add destination and dates
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black
    const startDate = new Date(itinerary.startDate);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + itinerary.duration - 1);

    doc.text(`Destination: ${itinerary.destination}`, 20, 30);
    doc.text(
      `Dates: ${format(startDate, "MMM dd, yyyy")} - ${format(endDate, "MMM dd, yyyy")}`,
      20,
      38,
    );
    doc.text(`Duration: ${itinerary.duration} days`, 20, 46);
    doc.text(`Total Budget: ₹${itinerary.totalCost.toLocaleString()}`, 20, 54);

    // Add description
    doc.setFontSize(10);
    doc.text("Description:", 20, 65);
    const descriptionLines = doc.splitTextToSize(itinerary.description, 170);
    doc.text(descriptionLines, 20, 72);

    // Add interests/tags
    let yPos = 72 + descriptionLines.length * 5;
    const tags = itinerary.tags || itinerary.preferences?.interests || [];
    if (tags.length > 0) {
      doc.text(`Tags: ${tags.join(", ")}`, 20, yPos);
      yPos += 10;
    }

    // Add a line
    doc.setDrawColor(0, 0, 128); // Dark blue
    doc.setLineWidth(0.5);
    doc.line(20, yPos, 190, yPos);
    yPos += 10;

    // Add daily itinerary
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 128); // Dark blue
    doc.text("Daily Itinerary", 105, yPos, { align: "center" });
    yPos += 10;

    // Loop through each day
    itinerary.days.forEach((day, index) => {
      // Check if we need a new page
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      // Add day header
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255); // White text
      doc.setFillColor(0, 0, 128); // Dark blue background
      doc.rect(20, yPos, 170, 8, "F");
      doc.text(`Day ${index + 1}: ${day.date}`, 25, yPos + 5.5);
      yPos += 12;

      // Add activities for the day
      day.activities.forEach((activity) => {
        // Check if we need a new page
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0); // Black text

        // Activity time and title
        doc.setFontSize(11);
        doc.setFont(undefined, "bold");
        doc.text(`${activity.time} - ${activity.title}`, 25, yPos);
        yPos += 5;

        // Activity description
        doc.setFontSize(10);
        doc.setFont(undefined, "normal");
        const activityDesc = doc.splitTextToSize(activity.description, 160);
        doc.text(activityDesc, 25, yPos);
        yPos += activityDesc.length * 5;

        // Activity location
        doc.text(`Location: ${activity.location}`, 25, yPos);
        yPos += 5;

        // Activity cost if available
        if (activity.cost) {
          doc.text(`Cost: ₹${activity.cost.toLocaleString()}`, 25, yPos);
          yPos += 5;
        }

        // Activity notes if available
        if (activity.notes) {
          const notesLines = doc.splitTextToSize(
            `Notes: ${activity.notes}`,
            160,
          );
          doc.text(notesLines, 25, yPos);
          yPos += notesLines.length * 5;
        }

        // Add some space between activities
        yPos += 5;
      });

      // Add some space between days
      yPos += 5;
    });

    // Add footer with generation date
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128); // Gray
      doc.text(
        `Generated on ${format(new Date(), "MMM dd, yyyy")} - North Bengal Travel Guide`,
        105,
        285,
        { align: "center" },
      );
      doc.text(`Page ${i} of ${pageCount}`, 190, 285, { align: "right" });
    }

    // Save the PDF
    const filename = `${itinerary.title.replace(/\s+/g, "_")}_Itinerary.pdf`;
    doc.save(filename);

    return filename;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate PDF");
  }
};

// Function to generate a shareable link by uploading the PDF to a server
export const generateShareableLink = async (
  itinerary: Itinerary,
): Promise<string> => {
  try {
    // Create a PDF blob
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(itinerary.title, 105, 20, { align: "center" });
    // Add more content to the PDF as needed
    const pdfBlob = doc.output("blob");

    // Create form data for the upload
    const formData = new FormData();
    formData.append(
      "file",
      pdfBlob,
      `${itinerary.title.replace(/\s+/g, "_")}_Itinerary.pdf`,
    );
    formData.append("itineraryId", itinerary.id);
    formData.append(
      "metadata",
      JSON.stringify({
        title: itinerary.title,
        destination: itinerary.destination,
        duration: itinerary.duration,
        startDate: itinerary.startDate,
      }),
    );

    // Upload to server
    const response = await fetch(
      "https://api.northbengaltravel.com/api/share",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: formData,
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to upload PDF: ${response.statusText}`);
    }

    const data = await response.json();
    return data.shareUrl; // Return the URL provided by the server
  } catch (error) {
    console.error("Error generating shareable link:", error);
    // Fallback to local link if server upload fails
    const baseUrl = window.location.origin;
    return `${baseUrl}/share/itinerary/${itinerary.id}`;
  }
};
