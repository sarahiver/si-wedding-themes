 Gifts() {
  const { content, project } = useWedding();
  const data = content?.gifts || {};
  const title = data.title || 'Geschenke';
  const description = data.description || 'Eure Anwesenheit ist das schoenste Geschenk. Wer uns dennoch etwas schenken moechte, kann gerne zu unserem Reisefonds beitragen.';
  const iban = data.iban || 'DE89 3704 0044 0532 0130 00';
  const holder = data.account_holder || (project?.partner1_name && project?.partner2_name ? `${project.partner1_name} & ${project.partner2_name}` : 'Alexandra & Benjamin');
  const bank = data.bank_name || 'Sparkasse';
  
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Section ref={sectionRef} id="gifts">
      <Container>
        <Eyebrow $visible={visible}>Aufmerksamkeit</Eyebrow>
        <Title $visible={visible}>{title}</Title>
        <Description $visible={visible}>{description}</Description>
        <BankCard $visible={visible}>
          <BankRow><BankLabel>Kontoinhaber</BankLabel><BankValue>{holder}</BankValue></BankRow>
          <BankRow><BankLabel>IBAN</BankLabel><BankValue>{iban}</BankValue></BankRow>
          <BankRow><BankLabel>Bank</BankLabel><BankValue>{bank}</BankValue></BankRow>
        </BankCard>
      </Container>
    </Section>
  );
}

export default Gifts;
