const collectionData = [
  {
    label: 'PRS / Modern Eagle',
    summary: '2007年に製造されたハカランダネックの初代モダンイーグル',
    type: 'Guitar',
  },
  {
    label: 'Momose / MT-SAKURA-SP18',
    summary: '2018年春ディバイザースペシャルモデルのテレキャスター',
    type: 'Guitar',
  },
  {
    label: 'Red House Guitars / Piccola S',
    summary: 'レリック加工されたストラトキャスター',
    type: 'Guitar',
  },
];

export default function CollectionPage() {
  return (
    <div className="flex flex-col gap-15">
      <section>
        <h2 className="text-sm leading-[1.6] mb-7">My Gear</h2>
        <div className="grid gap-6">
          {collectionData.map(({ label, summary, type }, index) => (
            <div key={index} className="flex gap-6">
              <div className="shrink-0 text-sm w-[6.5em]">
                <span className="font-light text-muted-foreground leading-[1.6]">{type}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-sm leading-[1.6]">{label}</p>
                <p className="text-sm text-muted-foreground leading-[1.6]">{summary}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
