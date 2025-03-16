import { Button } from '@workspace/ui/components';
import { Codesandbox, Github } from 'lucide-react';

export default function Home() {
  return (
    <div className="py-12">
      <div className="text-xl py-6">Output</div>
      <div className="grid gap-6">
        <div>
          <div>daisuke-tanabe</div>
          <div className="text-xs text-muted-foreground mt-1">ポートフォリオサイトのソース</div>
          <div className="flex mt-2 gap-1">
            <Button variant="ghost" size="icon" asChild className="size-7">
              <a href="https://github.com/daisuke-tanabe/daisuke-tanabe" target="_blank">
                <Github/>
              </a>
            </Button>
          </div>
        </div>
        <div>
          <div>as-props-polymorphic-component</div>
          <div className="text-xs text-muted-foreground mt-1">Polymorphic&thinsp;Component&thinsp;の作成</div>
          <div className="flex mt-2 gap-1">
            <Button variant="ghost" size="icon" asChild className="size-7">
              <a href="https://github.com/daisuke-tanabe/as-props-polymorphic-component" target="_blank">
                <Github/>
              </a>
            </Button>
          </div>
        </div>
        <div>
          <div>github-contributions-visualization</div>
          <div className="text-xs text-muted-foreground mt-1">
            Github&thinsp;の&thinsp;Contributions&thinsp;の可視化
          </div>
          <div className="flex mt-2 gap-2">
            <Button variant="ghost" size="icon" asChild className="size-7">
              <a href="https://github.com/daisuke-tanabe/github-contributions-visualization" target="_blank">
                <Github/>
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild className="size-7">
              <a href="https://codesandbox.io/p/sandbox/github-contributions-visualization-s5ky4x" target="_blank">
                <Codesandbox/>
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
