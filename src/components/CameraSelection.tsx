import { useGameStore } from '../store/gameStore';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Eye, Camera, Grid3X3 } from 'lucide-react';

export const CameraSelection = () => {
  const { cameraMode, setCameraMode } = useGameStore();

  const cameraOptions = [
    {
      mode: 'first-person' as const,
      icon: <Eye className="w-6 h-6" />,
      title: 'First Person',
      description: 'See from the ball\'s perspective'
    },
    {
      mode: 'third-person' as const,
      icon: <Camera className="w-6 h-6" />,
      title: 'Third Person',
      description: 'Camera follows behind the ball'
    },
    {
      mode: 'top-down' as const,
      icon: <Grid3X3 className="w-6 h-6" />,
      title: 'Top Down',
      description: 'Classic arcade view from above'
    }
  ];

  return (
    <Card className="cyber-border bg-card/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-center text-primary font-bold">
          Choose Camera Angle
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {cameraOptions.map((option) => (
          <Button
            key={option.mode}
            variant={cameraMode === option.mode ? "default" : "outline"}
            className={`w-full p-4 h-auto flex flex-col items-center gap-2 glow-effect ${
              cameraMode === option.mode 
                ? 'bg-primary text-primary-foreground shadow-[var(--glow-primary)]' 
                : 'hover:bg-primary/10'
            }`}
            onClick={() => setCameraMode(option.mode)}
          >
            <div className="flex items-center gap-3">
              {option.icon}
              <div className="text-left">
                <div className="font-semibold">{option.title}</div>
                <div className="text-sm opacity-80">{option.description}</div>
              </div>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};