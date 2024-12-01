import React from 'react';
import { FileDown } from 'lucide-react';

export function OrderCard({ order }) {
  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(value);

  // Update formatDate to also return the time
  const formatDate = (date) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    return date.toLocaleDateString('en-IN', options);
  };

  const truncateText = (text, maxLength) =>
    text.length > maxLength ? text.slice(0, maxLength) + '...' : text;

  // Update the DownloadButton to accept multiple URLs from pdflink and trigger a download
  const DownloadButton = ({ documentUrls }) => (
    <div className="space-y-2">
      {documentUrls.map((url, index) => (
        <button
          key={index}
          onClick={() => downloadPDF(url)}
          className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
        >
          <FileDown size={18} />
          Download PDF/Word 
        </button>
      ))}
    </div>
  );

  const downloadPDF = async (url) => {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = url.split('/').pop(); // Extract file name from URL
        link.style.display = 'none'; // Hide the anchor tag
        document.body.appendChild(link);
        link.click(); // Trigger the download
        document.body.removeChild(link); // Clean up the link element
      } else {
        console.error('Failed to fetch the file:', response.statusText);
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  // Collect all document URLs from order items where access_mode is 'online'
  // Here, we are looking at the 'pdflink' field to get URLs
  const documentUrls = order.orderItems
    .filter((item) => item.pdflink && item.pdflink.length > 0) // Only include items with pdflink
    .flatMap((item) => item.pdflink.map(pdf => pdf.url)); // Extract URLs from pdflink

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 hover:shadow-lg transition-shadow">
      <div className="p-6">
        {/* Order Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-gray-500">Order ID: {order.orderId}</p>
            <p className="text-sm text-gray-500">Date: {formatDate(new Date(order.orderDate))}</p>
            {/* Display the formatted time below the date */}
            <p className="text-sm text-gray-500">Time: {new Date(order.orderDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}</p>
          </div>
          {/* Show the DownloadButton only if there are PDF links */}
          {documentUrls.length > 0 && <DownloadButton documentUrls={documentUrls} />}
        </div>

        {/* Products */}
        <div className="space-y-4">
          {order.orderItems.map((product, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 border-b border-gray-100 last:border-0"
            >
              <img
                src={product.images[0]?.url}
                alt={product.title}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">
                  {truncateText(product.title, 60)}
                </h4>
                <div className="flex justify-between mt-1 text-sm text-gray-600">
                  <span>Qty: {product.quantity}</span>
                  <span>{formatCurrency(product.price)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total Order Value */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total:</span>
            <span className="text-lg font-semibold">
              {formatCurrency(order.totalAmount)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
