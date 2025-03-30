"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackForm = FeedbackForm;
const react_1 = require("react");
const Toast_1 = require("../Toast/Toast");
const FormComponents_1 = require("../Form/FormComponents");
function FeedbackForm() {
    const [feedback, setFeedback] = (0, react_1.useState)('');
    const [error, setError] = (0, react_1.useState)('');
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [toast, setToast] = (0, react_1.useState)({ show: false, message: '', type: 'success' });
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        setError('');
        if (!feedback.trim()) {
            setError('Пожалуйста, введите ваше сообщение');
            return;
        }
        setIsLoading(true);
        try {
            const response = yield fetch('http://localhost:3001/api/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: feedback })
            });
            if (!response.ok) {
                throw new Error('Failed to submit feedback');
            }
            setFeedback('');
            setToast({
                show: true,
                message: 'Спасибо за ваш отзыв!',
                type: 'success'
            });
        }
        catch (err) {
            setToast({
                show: true,
                message: 'Произошла ошибка при отправке формы',
                type: 'error'
            });
        }
        finally {
            setIsLoading(false);
        }
    });
    return (<FormComponents_1.FormContainer>
      <FormComponents_1.StyledForm onSubmit={handleSubmit}>
        <FormComponents_1.FormGroup>
          <FormComponents_1.Label htmlFor="feedback">
            Ваше сообщение
            <FormComponents_1.RequiredMark>*</FormComponents_1.RequiredMark>
          </FormComponents_1.Label>
          <FormComponents_1.TextArea id="feedback" value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Напишите ваше сообщение..." required aria-invalid={Boolean(error)}/>
          {error && (<FormComponents_1.ErrorMessage role="alert" aria-live="polite">
              {error}
            </FormComponents_1.ErrorMessage>)}
        </FormComponents_1.FormGroup>

        <FormComponents_1.SubmitButton type="submit" disabled={isLoading}>
          {isLoading ? 'Отправка...' : 'Отправить'}
        </FormComponents_1.SubmitButton>
      </FormComponents_1.StyledForm>

      {toast.show && (<Toast_1.Toast message={toast.message} type={toast.type} onClose={() => setToast(prev => (Object.assign(Object.assign({}, prev), { show: false })))}/>)}
    </FormComponents_1.FormContainer>);
}
