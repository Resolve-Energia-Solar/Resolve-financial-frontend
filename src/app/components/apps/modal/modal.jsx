'use client'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { motion } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  height: 300,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',

};


export default function BasicModal({ message, title, open, onClose, IconComponent, type }) {

  return (

    <Modal
      open={open}
      onClose={onClose}
    >
      <Box sx={style}>

        <Typography id="modal-modal-title" variant="h3" component="h2" >
          {title}
        </Typography>

        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          {message}
        </Typography>

        {/* <motion.div
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          {
            type ?
              <IconComponent sx={{ p: 2, fontSize: 150, color: 'success.main', }} /> :
              <IconComponent sx={{ p: 2, fontSize: 150, color: 'error.main', }} />
          }
        </motion.div> */}
      </Box>
    </Modal>

  );
}
