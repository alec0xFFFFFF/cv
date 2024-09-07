'use client';
import * as React from 'react';
import { useCanvasReactor } from './hooks/useCanvasReactor';

interface CanvasProps extends React.CanvasHTMLAttributes<HTMLCanvasElement> {
  ref?: React.RefCallback<HTMLCanvasElement>;
}

export const ShaderFrame: React.FC = () => {
  const { register } = useCanvasReactor();

  return (
    <canvas className="mx-auto" {...(register as CanvasProps)}>
      Your browser does not support the HTML5 canvas tag.
    </canvas>
  );
};
