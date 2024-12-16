import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import {
  Close as CloseIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { Document, Page } from "react-pdf";

const ViewFilepopup = ({ presignedUrl }) => {
  const [open, setOpen] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [pdfViewerError, setPdfViewerError] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handlePdfViewerError = (error) => {
    setPdfViewerError(error);
  };

  return (
    <>
      <Button
        variant="text"
        onClick={handleOpen}
        disabled={!presignedUrl}
        startIcon={<VisibilityIcon />}
        // sx={{
        //   borderRadius: '20px', 
        //   padding: '8px 16px', 
        //   backgroundColor: '#186F65', 
        //   color: '#FFFFFF', 
        //   '&:hover': {
        //     backgroundColor: '#145A54', 
        //   },
        //   '&:disabled': {
        //     backgroundColor: '#A5A5A5', 
        //   },
        // }}
      >
        View File
      </Button>


      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        PaperProps={{
          sx: {
            width: "60%",
            height: "80vh", // Set fixed height
            margin: "20px",
            display: "flex",
            flexDirection: "column", // Enable flex layout
          },
        }}
      >
        <DialogTitle sx={{ p: 2, flexShrink: 0 }}>
          {" "}
          {/* Prevent title from shrinking */}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            p: 2,
            flexGrow: 1, // Allow content to grow
            overflow: "hidden", // Hide outer content scroll
            display: "flex",
            flexDirection: "column",
          }}
        >
          {pdfViewerError ? (
            <div>
              <h3>Error while reading the PDF</h3>
              <p>
                {pdfViewerError.message
                  ? `Error: ${pdfViewerError.message}`
                  : "An unknown error occurred while loading the PDF."}
              </p>
              <p>Please try again. If the issue persists, contact support.</p>
            </div>
          ) : (
            <div
              style={{
                flexGrow: 1,
                overflow: "auto", // Enable scrolling for PDF content
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start", // Align to top
              }}
            >
              <Document
                file={presignedUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={handlePdfViewerError}
                loading={
                  <div>Loading PDF: {Math.round(loadingProgress * 100)}%</div>
                }
                onLoadProgress={({ loaded, total }) => {
                  setLoadingProgress(loaded / total);
                }}
              >
                <Page
                  pageNumber={pageNumber}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  scale={1.0}
                  width={window.innerWidth * 0.45}
                />
              </Document>
            </div>
          )}
        </DialogContent>

        {numPages && (
          <DialogActions sx={{ p: 1, flexShrink: 0 }}>
            {" "}
            {/* Prevent actions from shrinking */}
            <Button
              disabled={pageNumber <= 1}
              onClick={() => setPageNumber((prev) => prev - 1)}
              size="small"
            >
              Previous
            </Button>
            <span>
              Page {pageNumber} of {numPages}
            </span>
            <Button
              disabled={pageNumber >= numPages}
              onClick={() => setPageNumber((prev) => prev + 1)}
              size="small"
            >
              Next
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </>
  );
};

export default ViewFilepopup;
