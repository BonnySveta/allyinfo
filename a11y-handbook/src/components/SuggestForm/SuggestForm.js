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
exports.SuggestForm = SuggestForm;
const react_1 = require("react");
const navigation_1 = require("../../config/navigation");
const Toast_1 = require("../Toast/Toast");
const LinkPreview_1 = require("../LinkPreview/LinkPreview");
const FormComponents_1 = require("../Form/FormComponents");
const DRAFT_KEY = 'suggest-form-draft';
function SuggestForm({ getPreview }) {
    const [section, setSection] = (0, react_1.useState)('');
    const [url, setUrl] = (0, react_1.useState)('');
    const [description, setDescription] = (0, react_1.useState)('');
    const [error, setError] = (0, react_1.useState)('');
    const [urlError, setUrlError] = (0, react_1.useState)('');
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [previewData, setPreviewData] = (0, react_1.useState)(null);
    const [previewDescription, setPreviewDescription] = (0, react_1.useState)(null);
    const [isPreviewLoading, setIsPreviewLoading] = (0, react_1.useState)(false);
    const [toast, setToast] = (0, react_1.useState)({ show: false, message: '', type: 'success' });
    const sections = navigation_1.navigationConfig;
    const handleUrlChange = (e) => {
        const value = e.target.value;
        console.log('URL changed:', value);
        setUrl(value);
        setPreviewDescription(null);
        setIsPreviewLoading(true);
    };
    const handlePreviewLoad = (data) => {
        console.log('Preview loaded:', data);
        setIsPreviewLoading(false);
        if (data.description) {
            setPreviewDescription(data.description);
            setDescription(data.description);
        }
        else {
            setPreviewDescription(null);
        }
    };
    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        setError('');
        if (!section || !url) {
            setError('Пожалуйста, заполните все обязательные поля');
            return;
        }
        if (!validateUrl(url)) {
            return;
        }
        setIsLoading(true);
        try {
            const response = yield fetch('http://localhost:3001/api/suggestions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url,
                    section,
                    description: (previewData === null || previewData === void 0 ? void 0 : previewData.description) || null
                })
            });
            if (!response.ok) {
                throw new Error('Failed to submit suggestion');
            }
            clearDraft();
            setSection('');
            setUrl('');
            setDescription('');
            setPreviewData(null);
            setToast({
                show: true,
                message: 'Материал успешно предложен!',
                type: 'success'
            });
        }
        catch (err) {
            console.error('Error submitting suggestion:', err);
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
    const validateUrl = (value) => {
        try {
            new URL(value);
            setUrlError('');
            return true;
        }
        catch (_a) {
            setUrlError('Пожалуйста, введите корректный URL');
            return false;
        }
    };
    const clearDraft = () => {
        localStorage.removeItem(DRAFT_KEY);
    };
    // ... все useEffect и функции-обработчики остаются здесь ...
    return (<FormComponents_1.FormContainer>      
      <FormComponents_1.StyledForm onSubmit={handleSubmit} noValidate>
        <FormComponents_1.FormGroup>
          <FormComponents_1.Label htmlFor="section">
            <FormComponents_1.LabelText>
              Раздел
              <FormComponents_1.RequiredMark>*</FormComponents_1.RequiredMark>
            </FormComponents_1.LabelText>
          </FormComponents_1.Label>
          <FormComponents_1.Select id="section" value={section} onChange={(e) => setSection(e.target.value)} required aria-invalid={error && !section ? "true" : "false"}>
            <option value="">Выберите раздел</option>
            {sections.map((item) => (<option key={item.path} value={item.path}>
                {item.title}
              </option>))}
          </FormComponents_1.Select>
        </FormComponents_1.FormGroup>

        <FormComponents_1.FormGroup>
          <FormComponents_1.Label htmlFor="url">
            <FormComponents_1.LabelText>
              Ссылка на материал
              <FormComponents_1.RequiredMark>*</FormComponents_1.RequiredMark>
            </FormComponents_1.LabelText>
          </FormComponents_1.Label>
          <FormComponents_1.Input type="url" id="url" value={url} onChange={handleUrlChange} placeholder="https://example.com" required aria-invalid={Boolean(urlError)}/>
          {url && !urlError && (<LinkPreview_1.LinkPreview url={url} onLoad={handlePreviewLoad} getPreview={getPreview} section={section}/>)}
          {urlError && (<FormComponents_1.ErrorMessage role="alert" aria-live="polite">
              {urlError}
            </FormComponents_1.ErrorMessage>)}
        </FormComponents_1.FormGroup>

        {error && (<FormComponents_1.ErrorMessage role="alert" aria-live="polite">
            {error}
          </FormComponents_1.ErrorMessage>)}

        <FormComponents_1.SubmitButton type="submit" disabled={isLoading}>
          {isLoading ? (<>
              Отправка
              <FormComponents_1.LoadingSpinner />
            </>) : ('Отправить')}
        </FormComponents_1.SubmitButton>
      </FormComponents_1.StyledForm>

      {toast.show && (<Toast_1.Toast message={toast.message} type={toast.type} onClose={() => setToast(prev => (Object.assign(Object.assign({}, prev), { show: false })))}/>)}
    </FormComponents_1.FormContainer>);
}
