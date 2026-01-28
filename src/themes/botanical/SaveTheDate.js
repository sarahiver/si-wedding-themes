  opacity: 0;
`;

const LeafSVG = () => (
  <svg viewBox="0 0 100 100">
    <path d="M50 5 C20 25 10 60 50 95 C90 60 80 25 50 5 Z" />
  </svg>
);

function SaveTheDate() {
  const { coupleNames, weddingDate, getContent } = useWedding();
  const content = getContent('savethedate');
  
  const names = coupleNames?.split(/\s*[&+]\s*/) || ['Olivia', 'Benjamin'];
  
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <Page>
      <FloatingLeaf $size={100} $duration={8} $delay={0} style={{ top: '10%', left: '5%' }}><LeafSVG /></FloatingLeaf>
      <FloatingLeaf $size={70} $duration={10} $delay={2} style={{ top: '20%', right: '10%' }}><LeafSVG /></FloatingLeaf>
      <FloatingLeaf $size={80} $duration={7} $delay={1} style={{ bottom: '15%', left: '8%' }}><LeafSVG /></FloatingLeaf>
      <FloatingLeaf $size={60} $duration={9} $delay={3} style={{ bottom: '25%', right: '5%' }}><LeafSVG /></FloatingLeaf>
      
      <Content>
        <Eyebrow>{content.tagline || 'Save the Date'}</Eyebrow>
        
        <Names>
          {names[0]}
          <span>&</span>
          {names[1]}
        </Names>
        
        <Date>{formatDate(weddingDate)}</Date>
        <Location>{content.location_teaser || ''}</Location>
        
        {content.countdown_active !== false && (
          <Countdown weddingDate={weddingDate} showSeconds={false} />
        )}
        
        {content.message && <Message>{content.message}</Message>}
      </Content>
    </Page>
  );
}

export default SaveTheDate;
