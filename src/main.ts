import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ValidationError } from 'class-validator'

import { ValidationExceptionClass } from './filters/validation.exception'

import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.useGlobalPipes(
		new ValidationPipe({
			skipMissingProperties: true,
			exceptionFactory: (errors: ValidationError[]) => {
				return new ValidationExceptionClass(
					errors.map(error => {
						return {
							[error.property]: Object.values(error.constraints).reverse()
						}
					})
				)
			}
		})
	)

	await app.listen(process.env.PORT);
}

bootstrap();
