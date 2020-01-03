const bitgener = require('../../lib');

(async () => {
  try {
    const ret = await bitgener({
      data: '012345',
      type: 'code93',
      output: 'buffer',
      encoding: 'utf8',
      crc: false,
      padding: 25,
      barWidth: 5,
      barHeight: 150,
      original1DSize: true,
      addQuietZone: true,
      color: '#FFFFFF',
      bgColor: '#F7931A',
      hri: {
        show: true,
        fontFamily: 'Futura',
        fontSize: 25,
        marginTop: 9,
      },
    });

    console.log(ret);
  } catch (e) {
    console.error(e.toString());
  }
})();
