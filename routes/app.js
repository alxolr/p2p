const router = require('express').Router();
const config = require('config');

module.exports = router;

router.get('/', (req, res) => {
  res.render('index', {
    title: 'Streaming cameras',
  });
});

router.get('/watch/:id', (req, res) => {
  res.render('watch', {
    id: req.params.id,
    port: config.port,
  });
});

router.get('/stream', (req, res) => {
  res.render('stream', {
    port: config.port,
  });
});

router.get('/dashboard', (req, res) => {
  res.render('dashboard', {
    port: config.port,
  });
});

