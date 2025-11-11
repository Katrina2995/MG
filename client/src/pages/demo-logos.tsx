import { useState } from 'react';
import LogoCarousel from '@/components/LogoCarousel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function DemoLogosPage() {
  const [speed, setSpeed] = useState(60);
  const [gap, setGap] = useState(2);
  const [duplicateTrack, setDuplicateTrack] = useState(true);
  const [pauseOnHover, setPauseOnHover] = useState(true);
  const [reduceMotionFallback, setReduceMotionFallback] = useState<'static' | 'paged'>('static');

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" data-testid="text-page-title">
            Logo Carousel Demo
          </h1>
          <p className="text-muted-foreground text-lg">
            A reusable, infinite logo carousel component with full accessibility support
          </p>
        </div>

        {/* Live Demo */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Live Demo</CardTitle>
            <CardDescription>
              Adjust the controls below to see the carousel in action
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LogoCarousel
              speed={speed}
              gap={gap}
              duplicateTrack={duplicateTrack}
              pauseOnHover={pauseOnHover}
              reduceMotionFallback={reduceMotionFallback}
            />
          </CardContent>
        </Card>

        {/* Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>
              Customize the carousel behavior
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Speed */}
              <div className="space-y-2">
                <Label htmlFor="speed-input">
                  Speed (pixels/second): {speed}
                </Label>
                <Input
                  id="speed-input"
                  type="range"
                  min="20"
                  max="200"
                  step="10"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  data-testid="input-speed"
                />
              </div>

              {/* Gap */}
              <div className="space-y-2">
                <Label htmlFor="gap-input">
                  Gap (rem): {gap}
                </Label>
                <Input
                  id="gap-input"
                  type="range"
                  min="0.5"
                  max="4"
                  step="0.5"
                  value={gap}
                  onChange={(e) => setGap(Number(e.target.value))}
                  data-testid="input-gap"
                />
              </div>

              {/* Duplicate Track */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="duplicate-track"
                  checked={duplicateTrack}
                  onCheckedChange={setDuplicateTrack}
                  data-testid="switch-duplicate-track"
                />
                <Label htmlFor="duplicate-track">
                  Duplicate track for seamless loop
                </Label>
              </div>

              {/* Pause on Hover */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="pause-on-hover"
                  checked={pauseOnHover}
                  onCheckedChange={setPauseOnHover}
                  data-testid="switch-pause-on-hover"
                />
                <Label htmlFor="pause-on-hover">
                  Pause on hover
                </Label>
              </div>

              {/* Reduced Motion Fallback */}
              <div className="space-y-2">
                <Label htmlFor="reduced-motion-fallback">
                  Reduced Motion Fallback
                </Label>
                <Select
                  value={reduceMotionFallback}
                  onValueChange={(value) => setReduceMotionFallback(value as 'static' | 'paged')}
                >
                  <SelectTrigger id="reduced-motion-fallback" data-testid="select-reduced-motion">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="static">Static</SelectItem>
                    <SelectItem value="paged">Paged</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documentation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Infinite seamless scroll with no jitter</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Pause on hover and when offscreen</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Full keyboard navigation support</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Respects prefers-reduced-motion</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>ARIA roles and screen reader support</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Lazy loading for performance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>GPU-accelerated animations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Adapts to host page styling</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Props API</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div>
                  <code className="bg-muted px-2 py-1 rounded text-xs">speed?: number</code>
                  <p className="text-muted-foreground mt-1">Animation speed in px/sec (default: 60)</p>
                </div>
                <div>
                  <code className="bg-muted px-2 py-1 rounded text-xs">gap?: number</code>
                  <p className="text-muted-foreground mt-1">Gap between logos in rem (default: 2)</p>
                </div>
                <div>
                  <code className="bg-muted px-2 py-1 rounded text-xs">duplicateTrack?: boolean</code>
                  <p className="text-muted-foreground mt-1">Enable seamless loop (default: true)</p>
                </div>
                <div>
                  <code className="bg-muted px-2 py-1 rounded text-xs">pauseOnHover?: boolean</code>
                  <p className="text-muted-foreground mt-1">Pause on hover (default: true)</p>
                </div>
                <div>
                  <code className="bg-muted px-2 py-1 rounded text-xs">reduceMotionFallback?: 'static'|'paged'</code>
                  <p className="text-muted-foreground mt-1">Behavior for reduced motion</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Usage Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Usage Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Adding Logos</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Place your logo images (PNG, JPG, JPEG, SVG, or WebP) in the <code className="bg-muted px-1 py-0.5 rounded">/client_logos</code> directory.
                The component will automatically detect and display them.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Adding Links</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Create or edit <code className="bg-muted px-1 py-0.5 rounded">/client/src/data/client_logo_links.json</code> to add clickable links:
              </p>
              <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
{`{
  "acme_corp.svg": "https://acme.com",
  "tech_solutions.svg": "https://techsolutions.com"
}`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Basic Integration</h3>
              <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
{`import LogoCarousel from '@/components/LogoCarousel';

function MyPage() {
  return (
    <div>
      <h1>Our Clients</h1>
      <LogoCarousel
        speed={80}
        gap={3}
        pauseOnHover={true}
      />
    </div>
  );
}`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Theming</h3>
              <p className="text-sm text-muted-foreground mb-2">
                The carousel inherits colors from your page. You can customize it with CSS variables:
              </p>
              <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
{`:root {
  --carousel-control-bg: rgba(0, 0, 0, 0.1);
  --carousel-control-color: currentColor;
  --carousel-focus-color: #3b82f6;
  --carousel-logo-bg: white;
  --carousel-logo-shadow: rgba(0, 0, 0, 0.1);
}`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
