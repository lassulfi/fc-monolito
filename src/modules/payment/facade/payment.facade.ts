import UseCaseInterface from "../../@shared/use-case/use-case.interface";
import PaymentFacadeInterface, {
  PaymentFacadeInputDto,
  PaymentFacadeOutputDto,
} from "./payment.facade.interface";

export interface PaymentFacadeDeps {
  processPaymentUseCase: UseCaseInterface;
}

export default class PaymentFacade implements PaymentFacadeInterface {
  private readonly _processPaymentUseCase: UseCaseInterface;

  constructor({ processPaymentUseCase }: PaymentFacadeDeps) {
    this._processPaymentUseCase = processPaymentUseCase;
  }

  async process(input: PaymentFacadeInputDto): Promise<PaymentFacadeOutputDto> {
    return await this._processPaymentUseCase.execute(input)
  }
}
