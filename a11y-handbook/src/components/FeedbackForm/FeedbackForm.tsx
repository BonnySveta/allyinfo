import { useState, FormEvent } from 'react';
import { Toast } from '../Toast/Toast';
import {
  FormContainer,
  StyledForm,
  FormGroup,
  Label,
  TextArea,
  SubmitButton,
  ErrorMessage,
  RequiredMark
} from '../Form/FormComponents';
import { addFeedback } from '../../services/supabase';

export function FeedbackForm() {
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!feedback.trim()) {
      setError('Пожалуйста, введите ваше сообщение');
      return;
    }

    setIsLoading(true);

    try {
      await addFeedback(feedback);
      setFeedback('');
      setToast({
        show: true,
        message: 'Спасибо за ваш отзыв!',
        type: 'success'
      });
    } catch (err) {
      setToast({
        show: true,
        message: 'Произошла ошибка при отправке формы',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormContainer>
      <StyledForm onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="feedback">
            Ваше сообщение
            <RequiredMark>*</RequiredMark>
          </Label>
          <TextArea
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Напишите ваше сообщение..."
            required
            aria-invalid={Boolean(error)}
          />
          {error && (
            <ErrorMessage role="alert" aria-live="polite">
              {error}
            </ErrorMessage>
          )}
        </FormGroup>

        <SubmitButton type="submit" disabled={isLoading}>
          {isLoading ? 'Отправка...' : 'Отправить'}
        </SubmitButton>
      </StyledForm>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(prev => ({ ...prev, show: false }))}
        />
      )}
    </FormContainer>
  );
}

export default FeedbackForm; 