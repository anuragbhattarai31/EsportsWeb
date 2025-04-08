const path = require('path');
const fs = require('fs');

const checkFileExists = (req, res, next) => {
  const filePath = path.join(__dirname, '../public/uploads', req.params.filename);
  
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error('Missing file:', filePath);
      return res.status(404).json({ error: 'File not found' });
    }
    next();
  });
};

module.exports = checkFileExists;