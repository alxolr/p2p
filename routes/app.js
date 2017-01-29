const router = require('express').Router();

module.exports = router;

router.get('/', (req, res) => {
  res.render('index', {
    title: 'Streaming cameras',
  });
});

router.get('/watch/:id', (req, res) => {
  res.render('watch', {
    id: req.params.id,
  });
});

router.get('/stream', (req, res) => {
  res.render('stream', {});
});

