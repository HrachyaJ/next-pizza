import { InfoBlock } from "@/components/shared/info-block";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center mt-40">
      <InfoBlock
        title="Страница не найдена"
        text="К сожалению, данная страница не существует или была удалена"
        imageUrl="/assets/images/not-found.png"
      />
    </div>
  );
}
