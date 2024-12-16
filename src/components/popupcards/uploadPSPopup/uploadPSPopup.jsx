import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { useState, useRef } from "react";
import axios from "axios";
import { API_BASE_URL } from '../../../helpers/constant';
import axiosInstance from '../../../helpers/axios';




const UploadPSPopup = ({ channelId, onClose, onDone }) => {
  const [loading, setLoading] = useState(false);
  const [pStatement, setpStatement] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const fileInputRef = useRef(null);

  const handleUpload = async () => {
    if (!selectedFile) {
      setSnackbar({ open: true, message: "Please select a file to upload", severity: "warning" });
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("submitted_work", selectedFile);
    formData.append("problem_statement", pStatement);

    try {
      let token = localStorage.getItem("token");
      const response = await axiosInstance.post(
        `/api/channels/${channelId}/submissions/submit/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Token ${token}`, 
          },
        }
      );

     

      if (response.status === 201) {
        setSnackbar({ open: true, message: "File uploaded successfully!", severity: "success" });
        
        setTimeout(() => {
          onClose();
          onDone();
        }, 1000); 
      } else {
        setSnackbar({ open: true, message: "Unexpected response from the server.", severity: "error" });
      }
    } catch (error) {
      if (error.response) {
        setSnackbar({
          open: true,
          message: `Error: ${error.response.data.detail || "File upload failed"}`,
          severity: "error",
        });
      } else if (error.request) {
        setSnackbar({
          open: true,
          message: "No response received from the server.",
          severity: "error",
        });
      } else {
        setSnackbar({
          open: true,
          message: `Error: ${error.message}`,
          severity: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };
  const handleSelectedFile = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: "20px",
          width: "800px",
          padding: "16px",
        },
      }}
    >
      <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
        Share your Ideation
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Problem Statement"
          fullWidth
          margin="normal"
          variant="outlined"
          multiline
          minRows={5}
          value={pStatement}
          onInput={(e) => {
            const target = e.target;
            target.style.height = "auto";
            target.style.height = `${target.scrollHeight}px`;
            setpStatement(e.target.value);
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "20px",
            },
            "& textarea": {
              overflow: "hidden",
              resize: "none",
            },
          }}
        />
      </DialogContent>
      <DialogActions>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
             accept=".pdf"
            onChange={handleSelectedFile}
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={() => fileInputRef.current.click()}
            sx={{
              borderRadius: 20,
              padding: "8px 24px",
              backgroundColor: "#186F65",
              color: "white",
              alignSelf: "center",
              width: "500px",
            }}
          >
            {selectedFile ? selectedFile.name : "Upload File"}
          </Button>

          <Button
            onClick={handleUpload}
            variant="contained"
            disabled={loading || !pStatement.trim() || !selectedFile}
            sx={{
              borderRadius: 20,
              padding: "8px 24px",
              backgroundColor: "#186F65",
              color: "white",
              alignSelf: "center",
              width: "500px",
            }}
          >
            {loading ? <CircularProgress size={24} /> : "Done"}
          </Button>
        </Box>
      </DialogActions>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default UploadPSPopup;
