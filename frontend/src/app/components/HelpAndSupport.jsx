import { Phone, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";

export function HelpAndSupport() {
  return (
    <div className="container px-4 py-8 max-w-3xl">
      <h1 className="text-3xl mb-6 text-primary">Help & Support</h1>

      {/* FAQ */}
      <section className="space-y-4">
        <h2 className="text-xl">Frequently Asked Questions</h2>

        <details className="bg-muted p-4 rounded-lg">
          <summary className="cursor-pointer font-medium">
            What documents are required to rent a vehicle?
          </summary>
          <p className="mt-2 text-sm text-muted-foreground">
            A valid driving license and ID proof are required.
          </p>
        </details>

        <details className="bg-muted p-4 rounded-lg">
          <summary className="cursor-pointer font-medium">
            What happens if the vehicle is damaged?
          </summary>
          <p className="mt-2 text-sm text-muted-foreground">
            Damage charges are calculated after inspection based on severity.
          </p>
        </details>

        <details className="bg-muted p-4 rounded-lg">
          <summary className="cursor-pointer font-medium">
            Is there a late return penalty?
          </summary>
          <p className="mt-2 text-sm text-muted-foreground">
            Yes, ₹200 per hour applies after the grace period.
          </p>
        </details>
      </section>

      {/* Support */}
      <section className="mt-8 space-y-4">
        <h2 className="text-xl">Need Immediate Help?</h2>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 bg-muted p-4 rounded-lg flex items-center gap-3">
            <Phone className="h-6 w-6 text-primary" />
            <div>
              <p className="font-medium">Helpline</p>
              <p className="text-sm text-muted-foreground">
                +91 90000 12345
              </p>
            </div>
          </div>

          <div className="flex-1 bg-muted p-4 rounded-lg flex items-center gap-3">
            <MessageCircle className="h-6 w-6 text-primary" />
            <div>
              <p className="font-medium">Chat Support</p>
              <p className="text-sm text-muted-foreground">
                Available 24/7
              </p>
            </div>
          </div>
        </div>

        <Button className="mt-4 bg-gradient-to-r from-purple-600 to-pink-500">
          Open Chat Bot
        </Button>
      </section>
    </div>
  );
}
