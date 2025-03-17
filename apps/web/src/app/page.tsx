import { Button } from '@workspace/ui/components';
import { Codesandbox, Github } from 'lucide-react';

export default function Home() {
  return (
    <>
      <div className="my-10">
        <div className="text-xl py-5 leading-[1.6]">🚀 Output</div>
        <div className="grid gap-4">
          <div>
            <div className="leading-[1.6]">daisuke-tanabe</div>
            <div className="text-xs text-muted-foreground mt-1 leading-[1.8]">ポートフォリオサイトのソース</div>
            <div className="flex mt-1 gap-1">
              <Button variant="ghost" size="icon" asChild className="size-7">
                <a href="https://github.com/daisuke-tanabe/daisuke-tanabe" target="_blank">
                  <Github />
                </a>
              </Button>
            </div>
          </div>
          <div>
            <div className="leading-[1.6]">as-props-polymorphic-component</div>
            <div className="text-xs text-muted-foreground mt-1 leading-[1.8]">
              Polymorphic&thinsp;Component&thinsp;の作成
            </div>
            <div className="flex mt-1 gap-1">
              <Button variant="ghost" size="icon" asChild className="size-7">
                <a href="https://github.com/daisuke-tanabe/as-props-polymorphic-component" target="_blank">
                  <Github />
                </a>
              </Button>
            </div>
          </div>
          <div>
            <div className="leading-[1.6]">github-contributions-visualization</div>
            <div className="text-xs text-muted-foreground mt-1 leading-[1.8]">
              Github&thinsp;の&thinsp;Contributions&thinsp;の可視化
            </div>
            <div className="flex mt-1 gap-1">
              <Button variant="ghost" size="icon" asChild className="size-7">
                <a href="https://github.com/daisuke-tanabe/github-contributions-visualization" target="_blank">
                  <Github />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild className="size-7">
                <a href="https://codesandbox.io/p/sandbox/github-contributions-visualization-s5ky4x" target="_blank">
                  <Codesandbox />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="my-10">
        <div className="text-xl py-5 leading-[1.6]">🛠 My Gear</div>
        <div className="grid gap-4">
          <div>
            <div className="leading-[1.6]">PRS / Modern Eagle</div>
            <div className="text-xs text-muted-foreground mt-1 leading-[1.8]">
              2007年に製造されたハカランダネックの初代モダンイーグル
            </div>
          </div>
          <div>
            <div className="leading-[1.6]">Momose / MT-SAKURA-SP18</div>
            <div className="text-xs text-muted-foreground mt-1 leading-[1.8]">
              2018年春ディバイザースペシャルモデルのテレキャスター
            </div>
          </div>
          <div>
            <div className="leading-[1.6]">Red House Guitars / Piccola S</div>
            <div className="text-xs text-muted-foreground mt-1 leading-[1.8]">レリック加工されたストラトキャスター</div>
          </div>
        </div>
      </div>
    </>
  );
}
