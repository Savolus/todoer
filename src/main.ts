import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ValidationError } from 'class-validator'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { version } from '../package.json'

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

	const options = new DocumentBuilder()
		.setTitle('Todo project')
		.setDescription('The todo project API description')
		.setVersion(version)
		.addSecurity('user', {
			type: 'http',
			scheme: 'bearer'
		})
		.build()

	const document = SwaggerModule.createDocument(app, options);
	
	SwaggerModule.setup('swagger-ui', app, document);

	await app.listen(process.env.PORT);
}

bootstrap();
