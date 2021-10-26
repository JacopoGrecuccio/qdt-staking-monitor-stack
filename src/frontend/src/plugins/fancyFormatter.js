const fancyFormatter =  {
  QDTAmount(amount) {
    let am = Number.parseFloat(amount)/(10**18)
    if(am>=0 && am<999)
    {
      return am.toFixed(2)+'';
    } else if(am>=1000 && am<999999)
    {
      return (am/1000).toFixed(2)+'k';
    } else if(am>=1000000 && am<999999999)
    {
      return (am/1000000).toFixed(2)+'M';
    } else if(am>=1000000000 && am<999999999999)
    {
      return (am/1000000).toFixed(2)+'B';
    } else
    {
      return am.toFixed(2)+'';
    }
  },
  timestampToDate(timestampSec) {
    return (new Date(timestampSec*1000).toLocaleDateString())
  }
}

export default fancyFormatter;
