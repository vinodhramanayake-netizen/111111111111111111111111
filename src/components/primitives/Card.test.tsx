import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Card } from './Card';

describe('Card', () => {
  it('renders a title as a heading plus its children', () => {
    render(
      <Card title="Tickets by Tag">
        <p>body content</p>
      </Card>,
    );
    expect(screen.getByRole('heading', { name: 'Tickets by Tag' })).toBeInTheDocument();
    expect(screen.getByText('body content')).toBeInTheDocument();
  });

  it('supports a custom heading level', () => {
    render(<Card title="Sub card" headingLevel={3} />);
    expect(screen.getByRole('heading', { level: 3, name: 'Sub card' })).toBeInTheDocument();
  });

  it('renders without a header when no title or action is given', () => {
    render(<Card aria-label="plain card">just content</Card>);
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(screen.getByText('just content')).toBeInTheDocument();
  });

  it('renders an action slot', () => {
    render(
      <Card title="With action" action={<span>legend</span>}>
        body
      </Card>,
    );
    expect(screen.getByText('legend')).toBeInTheDocument();
  });
});
