import { PlaceOrderInputDto } from "./place-order.dto";
import PlaceOrderUseCase from "./place-order.usecase";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";


describe("Place order use case unit test", () => {
  const mockClientFacade = {
    find: jest.fn(),
  };
  
  const mockProductFacade = {
    addProduct: jest.fn(),
    checkStock: jest.fn()
  }

  const mockCatalogFacade = {
    find: jest.fn(),
  }

  describe("validate products method", () => {
    afterEach(() => {
      jest.clearAllMocks();
    })

    const placeOrderUseCase = new PlaceOrderUseCase({
      clientFacade: mockClientFacade as any,
      productFacade: mockProductFacade,
      catalogFacade: mockCatalogFacade as any,
      checkoutRepository: undefined,
      invoiceFacade: undefined,
      paymentFacade: undefined,
    });

    it("should throw error if no products are selected", async () => {
      const input: PlaceOrderInputDto = {
        clientId: "1",
        products: [],
      };

      await expect(
        placeOrderUseCase["validateProducts"](input.products)
      ).rejects.toThrow(new Error("No products selected"));
    });

    it("should throw an error when product id out of stock", async () => {
      const checkStockSpy = jest
        .spyOn(mockProductFacade, "checkStock")
        .mockImplementation(({ productId }: { productId: string }) =>
          Promise.resolve({
            productId,
            stock: productId === "1" ? 0 : 1,
          })
        );

      const placeOrderUseCase = new PlaceOrderUseCase({
        clientFacade: mockClientFacade as any,
        productFacade: mockProductFacade,
        catalogFacade: undefined,
        checkoutRepository: undefined,
        invoiceFacade: undefined,
        paymentFacade: undefined,
      });

      let input = {
        clientId: "0",
        products: [{ productId: "1" }],
      };

      await expect(
        placeOrderUseCase["validateProducts"](input.products)
      ).rejects.toThrow(new Error("Product ID [1] is not available in stock"));

      input = {
        clientId: "0",
        products: [{ productId: "0" }, { productId: "1" }],
      };

      await expect(
        placeOrderUseCase["validateProducts"](input.products)
      ).rejects.toThrow(new Error("Product ID [1] is not available in stock"));
      
      expect(checkStockSpy).toHaveBeenCalledTimes(3);

      input = {
        clientId: "0",
        products: [{ productId: "0" }, { productId: "1" }, { productId: "2" }],
      };

      await expect(
        placeOrderUseCase["validateProducts"](input.products)
      ).rejects.toThrow(new Error("Product ID [1] is not available in stock"));
      expect(checkStockSpy).toHaveBeenCalledTimes(5);
    });
  });

  const mockDate = new Date(2000, 1, 1)

  describe("get products method", () => {
    beforeAll(() => {
      jest.useFakeTimers("modern")
      jest.setSystemTime(mockDate)
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    afterAll(() => {
      jest.useRealTimers()
    })

    const placeOrderUseCase = new PlaceOrderUseCase({
      clientFacade: mockClientFacade as any,
      productFacade: mockProductFacade,
      catalogFacade: mockCatalogFacade as any,
      checkoutRepository: undefined,
      invoiceFacade: undefined,
      paymentFacade: undefined,
    })

    it("should thrown an error when product not found", async() => {
      const findCatalogSpy = jest.spyOn(mockCatalogFacade, "find")

      await expect(placeOrderUseCase["getProduct"]("0")).rejects.toThrow(new Error("Product ID [0] not found"))
      expect(findCatalogSpy).toHaveBeenCalledTimes(1)
    })
    
    it("should return a product", async () => {
      const findCatalogSpy = jest.spyOn(mockCatalogFacade, "find")
        .mockResolvedValue({
          id: "0",
          name: "Product 0",
          description: "Product 0 description",
          salesPrice: 0,
        })
  
        await expect(placeOrderUseCase["getProduct"]("0")).resolves.toEqual(new Product({
          id: new Id("0"),
          name: "Product 0",
          description: "Product 0 description",
          salesPrice: 0
        }))

        expect(findCatalogSpy).toHaveBeenCalledWith({id: "0"})
    })
  })


  describe("execute method", () => {
    beforeAll(() => {
      jest.useFakeTimers("modern")
      jest.setSystemTime(mockDate)
    })

    afterAll(() => {
      jest.useRealTimers()
    })

    it("should thrown an error when client not found", async () => {
      const findClientSpy = jest
        .spyOn(mockClientFacade, "find")
        .mockResolvedValue(null);

      const placeOrderUseCase = new PlaceOrderUseCase({
        clientFacade: mockClientFacade as any,
        productFacade: undefined,
        catalogFacade: undefined,
        checkoutRepository: undefined,
        invoiceFacade: undefined,
        paymentFacade: undefined,
      });

      const input: PlaceOrderInputDto = {
        clientId: "0",
        products: [],
      };

      await expect(placeOrderUseCase.execute(input)).rejects.toThrow(
        new Error(`Client ID [${input.clientId}] not found `)
      );
      expect(findClientSpy).toHaveBeenCalledWith({ id: input.clientId });
    });

    it("should throw an error when products are not valid", async () => {
      const placeOrderUseCase = new PlaceOrderUseCase({
        clientFacade: mockClientFacade as any,
        productFacade: mockProductFacade,
        catalogFacade: undefined,
        checkoutRepository: undefined,
        invoiceFacade: undefined,
        paymentFacade: undefined,
      });

      const findClientSpy = jest
        .spyOn(mockClientFacade, "find")
        .mockResolvedValue({});

      const mockValidateProducts = jest
        // @ts-expect-error - spy on private method
        .spyOn(placeOrderUseCase, "validateProducts")
        // @ts-expect-error - not return never
        .mockRejectedValue(new Error("No products selected"));

      const input: PlaceOrderInputDto = {
        clientId: "1",
        products: [],
      };

      await expect(placeOrderUseCase.execute(input)).rejects.toThrow(
        new Error("No products selected")
      );
      expect(findClientSpy).toHaveBeenCalledWith({ id: input.clientId });
      expect(mockValidateProducts).toHaveBeenCalledTimes(1);
    });

    describe("place an order", () => {
      afterEach(() => {
        jest.clearAllMocks()
      })

      const clientProps = {
        id: "c1",
        name: "Client 1",
        document: "00000",
        email: "client@user.com",
        street: "some address",
        number: "123",
        complement: "Some complement",
        city: "some city",
        state: "some state",
        zipCode: "000",
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const findClientSpy = jest.spyOn(mockClientFacade, "find")
        .mockResolvedValue(clientProps)

      const mockPaymentFacade = {
        process: jest.fn()
      }

      const mockCheckoutRepository = {
        addOrder: jest.fn()
      }

      const addOrderSpy = jest.spyOn(mockCheckoutRepository, "addOrder")

      const mockInvoiceFacade = {
        generate: jest.fn()
      }

      const createInvoiceSpy = jest.spyOn(mockInvoiceFacade, "generate")
        .mockResolvedValue({id: "1i"})

      const placeOrderUseCase = new PlaceOrderUseCase({
        clientFacade: mockClientFacade as any,
        productFacade: null,
        catalogFacade: null,
        checkoutRepository: mockCheckoutRepository as any,
        paymentFacade: mockPaymentFacade,
        invoiceFacade: mockInvoiceFacade as any,
      })

      const products = {
        "1": new Product({
          id: new Id("1"),
          name: "Product 1",
          description: "Product 1 description",
          salesPrice: 40
        }), 
        "2": new Product({
          id: new Id("2"),
          name: "Product 2",
          description: "Product 2 description",
          salesPrice: 30
        })
      }

      const mockValidateProducts = jest
        // @ts-expect-error - spy on private method  
        .spyOn(placeOrderUseCase, "validateProducts")
        // @ts-expect-error - spy on private method
        .mockResolvedValue(null)

      const mockGetProduct = jest
        // @ts-expect-error - spy on private method
        .spyOn(placeOrderUseCase, "getProduct")
        // @ts-expect-error - not return never
        .mockImplementation((productId: keyof typeof products) => products[productId])

      it("should not be approved", async () => {
        const processPaymentSpy = jest.spyOn(mockPaymentFacade, "process")
          .mockResolvedValue({
            transactionId: "1t",
            orderId: "1o",
            amount: 100,
            status: "rejected",
            createdAt: new Date(),
            updatedAt: new Date()
          })
        
        const input: PlaceOrderInputDto = {
          clientId: "1c",
          products: [{ productId: "1" }, { productId: "2" }],
        }

        const output = await placeOrderUseCase.execute(input)

        expect(output).toBeDefined()
        expect(output.id).toBeDefined()
        expect(output.invoiceId).toBeNull()
        expect(output.status).toBe("rejected")
        expect(output.total).toBe(70)
        expect(output.products).toStrictEqual([{
          productId: "1",
        }, {
          productId: "2",
        }])
        expect(findClientSpy).toHaveBeenCalledTimes(1)
        expect(findClientSpy).toHaveBeenCalledWith({id: "1c"})
        expect(mockValidateProducts).toHaveBeenCalledTimes(1)
        expect(mockValidateProducts).toHaveBeenCalledWith(Object.keys(products).map(key => ({productId: key})))
        expect(mockGetProduct).toHaveBeenCalledTimes(2)
        expect(addOrderSpy).toHaveBeenCalledTimes(1)
        expect(processPaymentSpy).toHaveBeenCalledTimes(1)
        expect(processPaymentSpy).toHaveBeenCalledWith({
          orderId: output.id,
          amount: output.total
        })
        expect(createInvoiceSpy).toHaveBeenCalledTimes(0)
      })

      it("should be approved", async () => {
        const processPaymentSpy = jest.spyOn(mockPaymentFacade, "process")
          .mockResolvedValue({
            transactionId: "1t",
            orderId: "1o",
            amount: 100,
            status: "approved",
            createdAt: new Date(),
            updatedAt: new Date()
          })

        const input: PlaceOrderInputDto = {
          clientId: "1c",
          products: [{ productId: "1" }, { productId: "2" }],
        }

        const output = await placeOrderUseCase.execute(input)
        expect(output).toBeDefined()
        expect(output.id).toBeDefined()
        expect(output.invoiceId).toBe('1i')
        expect(output.status).toBe("approved")
        expect(output.total).toBe(70)
        expect(output.products).toStrictEqual([{
          productId: "1",
        }, {
          productId: "2",
        }])
        expect(findClientSpy).toHaveBeenCalledTimes(1)
        expect(findClientSpy).toHaveBeenCalledWith({id: "1c"})
        expect(mockValidateProducts).toHaveBeenCalledTimes(1)
        expect(mockValidateProducts).toHaveBeenCalledWith(Object.keys(products).map(key => ({productId: key})))
        expect(mockGetProduct).toHaveBeenCalledTimes(2)
        expect(addOrderSpy).toHaveBeenCalledTimes(1)
        expect(processPaymentSpy).toHaveBeenCalledTimes(1)
        expect(processPaymentSpy).toHaveBeenCalledWith({
          orderId: output.id,
          amount: output.total
        })
        expect(createInvoiceSpy).toHaveBeenCalledTimes(1)
        expect(createInvoiceSpy).toHaveBeenCalledWith({
          name: clientProps.name,
          document: clientProps.document,
          street: clientProps.street,
          number: clientProps.number,
          complement: clientProps.complement,
          city: clientProps.city,
          state: clientProps.state,
          zipCode: clientProps.zipCode,
          items: [{
            id: products["1"].id.id,
            name: products["1"].name,
            price: products["1"].salesPrice,
          }, {
            id: products["2"].id.id,
            name: products["2"].name,
            price: products["2"].salesPrice,
          }]
        })

      })
    })
  });
});
