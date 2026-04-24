const React = require('react');
const { render, fireEvent, screen, waitFor, act } = require('@testing-library/react');
const userEvent = require('@testing-library/user-event').default;
const PromptInput = require('../../src/components/PromptInput').default;

describe('PromptInput component', () => {
  let onSendSpy;
  let originalFetch;

  beforeAll(() => {
    originalFetch = global.fetch;
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  beforeEach(() => {
    onSendSpy = jasmine.createSpy('onSend');
    // Set default mock (three models)
    global.fetch = jasmine.createSpy('fetch').and.callFake(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ models: ['gemma3:270m', 'llama3.2:1b', 'phi3:mini'] })
      })
    );
  });

  afterEach(() => {
    global.fetch = undefined;
  });

  it('renders with default model selected and fetches available models', async () => {
    render(<PromptInput onSend={onSendSpy} />);
    // Wait for fetch to be called
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    // Wait for checkboxes
    await waitFor(() => {
      expect(screen.getByRole('checkbox', { name: /gemma3:270m/i })).toBeTruthy();
      expect(screen.getByRole('checkbox', { name: /llama3.2:1b/i })).toBeTruthy();
      expect(screen.getByRole('checkbox', { name: /phi3:mini/i })).toBeTruthy();
    });
    const gemmaCheckbox = screen.getByRole('checkbox', { name: /gemma3:270m/i });
    expect(gemmaCheckbox.checked).toBe(true);
  });

  it('allows selecting additional models', async () => {
    render(<PromptInput onSend={onSendSpy} />);
    await waitFor(() => screen.getByRole('checkbox', { name: /llama3.2:1b/i }));
    const llamaCheckbox = screen.getByRole('checkbox', { name: /llama3.2:1b/i });
    expect(llamaCheckbox.checked).toBe(false);
    fireEvent.click(llamaCheckbox);
    expect(llamaCheckbox.checked).toBe(true);
  });

  it('allows deselecting a model when at least one remains', async () => {
    render(<PromptInput onSend={onSendSpy} />);
    await waitFor(() => screen.getByRole('checkbox', { name: /llama3.2:1b/i }));
    const gemmaCheckbox = screen.getByRole('checkbox', { name: /gemma3:270m/i });
    const llamaCheckbox = screen.getByRole('checkbox', { name: /llama3.2:1b/i });
    expect(gemmaCheckbox.checked).toBe(true);
    expect(llamaCheckbox.checked).toBe(false);
    fireEvent.click(llamaCheckbox);
    expect(llamaCheckbox.checked).toBe(true);
    fireEvent.click(gemmaCheckbox);
    expect(gemmaCheckbox.checked).toBe(false);
    expect(llamaCheckbox.checked).toBe(true);
  });

  it('prevents deselecting the last selected model', async () => {
    render(<PromptInput onSend={onSendSpy} />);
    await waitFor(() => screen.getByRole('checkbox', { name: /gemma3:270m/i }));
    const gemmaCheckbox = screen.getByRole('checkbox', { name: /gemma3:270m/i });
    expect(gemmaCheckbox.checked).toBe(true);
    fireEvent.click(gemmaCheckbox);
    expect(gemmaCheckbox.checked).toBe(true);
  });

  it('calls onSend with prompt and selected models when submitting', async () => {
    render(<PromptInput onSend={onSendSpy} />);
    await waitFor(() => screen.getByRole('checkbox', { name: /llama3.2:1b/i }));
    const llamaCheckbox = screen.getByRole('checkbox', { name: /llama3.2:1b/i });
    fireEvent.click(llamaCheckbox);
    const input = screen.getByPlaceholderText('Ask me anything...');
    const submitBtn = screen.getByRole('button', { name: /send/i });
    await userEvent.type(input, 'Hello world');
    fireEvent.click(submitBtn);
    expect(onSendSpy).toHaveBeenCalledWith('Hello world', ['gemma3:270m', 'llama3.2:1b']);
  });

  it('disables checkboxes and submit button when loading prop is true', async () => {
    render(<PromptInput onSend={onSendSpy} loading={true} />);
    const gemmaCheckbox = await screen.findByRole('checkbox', { name: /gemma3:270m/i });
    const submitBtn = screen.getByRole('button', { name: /sending/i });
    expect(gemmaCheckbox.disabled).toBe(true);
    expect(submitBtn.disabled).toBe(true);
  });

  it('displays an error message when error prop is provided', () => {
    render(<PromptInput onSend={onSendSpy} error="Something went wrong" />);
    expect(screen.getByText('Something went wrong')).toBeTruthy();
  });
});