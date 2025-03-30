"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadingSpinner = exports.RequiredFieldsHint = exports.LabelText = exports.HintText = exports.RequiredMark = exports.ErrorMessage = exports.SubmitButton = exports.TextArea = exports.Input = exports.Select = exports.Label = exports.FormGroup = exports.StyledForm = exports.FormContainer = void 0;
const styled_components_1 = __importStar(require("styled-components"));
const react_1 = require("react");
exports.FormContainer = styled_components_1.default.div `
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 0;
  }
`;
exports.StyledForm = styled_components_1.default.form `
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;
exports.FormGroup = styled_components_1.default.div `
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;
exports.Label = styled_components_1.default.label `
  color: var(--text-color);
  font-weight: 500;
  
  ${props => props.required && `
    &::after {
      content: '*';
      color: var(--error-color);
      margin-left: 4px;
      aria-hidden: true;
    }
  `}
`;
const SelectWrapper = styled_components_1.default.div `
  position: relative;
  margin-bottom: 1rem;
`;
const StyledSelect = styled_components_1.default.select `
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--input-background);
  color: var(--text-color);
  font-size: 1rem;
  width: 100%;

  &:focus {
    outline: 2px solid var(--accent-color);
    outline-offset: 2px;
  }
`;
const KeyboardHint = styled_components_1.default.div `
  position: absolute;
  bottom: -1.5rem;
  left: 0;
  font-size: 0.75rem;
  color: var(--text-secondary);
`;
exports.Select = (0, react_1.forwardRef)((_a, ref) => {
    var { error, required, children } = _a, props = __rest(_a, ["error", "required", "children"]);
    return (<SelectWrapper>
        <StyledSelect ref={ref} required={required} aria-invalid={!!error} {...props}/>
        {error && <exports.ErrorMessage>{error}</exports.ErrorMessage>}
      </SelectWrapper>);
});
exports.Input = styled_components_1.default.input `
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--input-background);
  color: var(--text-color);
  font-size: 1rem;
  width: 100%;

  &:focus {
    outline: 2px solid var(--accent-color);
    outline-offset: 2px;
  }
`;
exports.TextArea = styled_components_1.default.textarea `
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--input-background);
  color: var(--text-color);
  font-size: 1rem;
  width: 100%;
  min-height: 150px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 2px var(--accent-color-alpha);
  }

  &::placeholder {
    color: var(--text-secondary);
  }

  &:hover {
    border-color: var(--border-hover-color, #999);
  }
`;
exports.SubmitButton = styled_components_1.default.button `
  width: 100%;
  padding: 12px;
  background-color: var(--primary-color, #0066cc);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--primary-hover-color, #0052a3);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 102, 204, 0.2);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 102, 204, 0.2);
  }

  &:disabled {
    background-color: var(--disabled-color, #cccccc);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  &:focus {
    outline: 2px solid var(--accent-color);
    outline-offset: 2px;
  }
`;
exports.ErrorMessage = styled_components_1.default.div `
  color: var(--error-color);
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;
exports.RequiredMark = styled_components_1.default.span.attrs({
    'aria-hidden': 'true'
}) `
  color: var(--error-color);
  margin-left: 4px;
`;
exports.HintText = styled_components_1.default.span `
  color: var(--text-secondary-color);
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;
exports.LabelText = styled_components_1.default.span `
  display: inline-flex;
  align-items: center;
`;
exports.RequiredFieldsHint = styled_components_1.default.p `
  color: var(--text-secondary-color);
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
`;
const spin = (0, styled_components_1.keyframes) `
  to {
    transform: rotate(360deg);
  }
`;
exports.LoadingSpinner = styled_components_1.default.div `
  width: 20px;
  height: 20px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: ${spin} 1s linear infinite;
  margin-left: 0.5rem;
`;
