const { Resource } = require("@opentelemetry/resources");
const { SemanticResourceAttributes } = require("@opentelemetry/semantic-conventions");
const { ConsoleSpanExporter } = require('@opentelemetry/sdk-trace-base');
const { SimpleSpanProcessor } = require("@opentelemetry/sdk-trace-base");
const { NodeTracerProvider } = require("@opentelemetry/sdk-trace-node");
const { trace } = require("@opentelemetry/api");
//Instrumentations
const { ExpressInstrumentation } = require("@opentelemetry/instrumentation-express");
const { MongoDBInstrumentation } = require("@opentelemetry/instrumentation-mongodb");
const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");
const { registerInstrumentations } = require("@opentelemetry/instrumentation");

//Jaeger
const { JaegerExporter } = require("@opentelemetry/exporter-jaeger");

//Exporter
module.exports = (serviceName) => {
//const exporter = new ConsoleSpanExporter();
const exporter = new JaegerExporter({
    endpoint: "http://localhost:14268/api/traces",
  });
const provider = new NodeTracerProvider({
resource: new Resource({
[SemanticResourceAttributes.SERVICE_NAME]: serviceName,
}),
});
provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
provider.register();
registerInstrumentations({
instrumentations: [
new HttpInstrumentation(),
new ExpressInstrumentation(),
new MongoDBInstrumentation(),
],
tracerProvider: provider,
});
return trace.getTracer(serviceName);
};