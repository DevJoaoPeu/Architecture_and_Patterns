import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';

export const ValidatedFile = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const file = request.file;

    if (!file) {
      throw new BadRequestException('Arquivo é obrigatório');
    }

    return file;
  },
);
