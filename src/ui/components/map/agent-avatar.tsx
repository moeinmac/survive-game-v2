import { memo, type ReactNode } from "react";
import type { AgentType } from "../../../core/types";
import { AGENT_THEME } from "../../constants/theme";

const INK = "#1E1B2E";

interface AvatarProps {
  fill: string;
  hungry: boolean;
}

function Highlight() {
  return <ellipse cx="8.5" cy="10" rx="2.6" ry="1.6" fill="#fff" opacity="0.28" />;
}

function Tear() {
  return <path d="M5.6 15.4q-1.1 1.7 0 2.5q1.1-.8 0-2.5z" fill="#93C5FD" />;
}

function HardWorker({ fill, hungry }: AvatarProps) {
  return (
    <>
      <circle cx="12" cy="14" r="9" fill={fill} />
      <Highlight />
      <path d="M4.6 10.2a7.4 6.6 0 0 1 14.8 0z" fill="#FACC15" />
      <rect x="3" y="9.4" width="18" height="2.2" rx="1.1" fill="#EAB308" />
      <rect x="11.2" y="4.2" width="1.6" height="5.4" rx="0.8" fill="#FDE047" />
      <circle cx="9" cy="15" r="1.4" fill={INK} />
      <circle cx="15" cy="15" r="1.4" fill={INK} />
      <path d="M10.4 19h3.2" stroke={INK} strokeWidth="1.3" strokeLinecap="round" />
      {hungry ? <Tear /> : <path d="M20.2 12.6q-1 1.5 0 2.2q1-.7 0-2.2z" fill="#BAE6FD" />}
    </>
  );
}

function Contented({ fill, hungry }: AvatarProps) {
  return (
    <>
      <ellipse cx="12" cy="3.4" rx="4.6" ry="1.3" fill="none" stroke="#FDE68A" strokeWidth="1.3" />
      <circle cx="12" cy="14" r="9.2" fill={fill} />
      <Highlight />
      <path
        d="M7.8 13.4q1.4-1.7 2.8 0M13.4 13.4q1.4-1.7 2.8 0"
        fill="none"
        stroke={INK}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <ellipse cx="7.2" cy="16.3" rx="1.6" ry="1" fill="#FFD1E0" opacity="0.75" />
      <ellipse cx="16.8" cy="16.3" rx="1.6" ry="1" fill="#FFD1E0" opacity="0.75" />
      <path
        d={hungry ? "M10.2 18.6q1.8-1.2 3.6 0" : "M10 17.2q2 2 4 0"}
        fill="none"
        stroke={INK}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      {hungry ? <Tear /> : null}
    </>
  );
}

function Talented({ fill, hungry }: AvatarProps) {
  return (
    <>
      <path
        d="M12 .6l1 2.2 2.3.3-1.7 1.6.5 2.3L12 5.9 9.9 7l.5-2.3-1.7-1.6 2.3-.3z"
        fill="#FDE047"
      />
      <rect x="3" y="5.5" width="18" height="17.5" rx="7" fill={fill} />
      <Highlight />
      <path
        d="M6.8 11l3.6 1.5M17.2 11l-3.6 1.5"
        stroke={INK}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="9" cy="14.6" r="1.4" fill={INK} />
      <circle cx="15" cy="14.6" r="1.4" fill={INK} />
      <path
        d="M10 19.4q2-1.5 4 0"
        fill="none"
        stroke={INK}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      {hungry ? <Tear /> : null}
    </>
  );
}

function Aristocrat({ fill, hungry }: AvatarProps) {
  return (
    <>
      <ellipse cx="12" cy="14.6" rx="9.6" ry="8.4" fill={fill} />
      <Highlight />
      <path d="M7 8l.4-4.6 2.6 2.4 2-3.2 2 3.2 2.6-2.4.4 4.6z" fill="#FCD34D" />
      <circle cx="12" cy="4.6" r="0.8" fill="#38BDF8" />
      <path
        d="M7.6 13.6h3M13.4 13.6h3"
        stroke={INK}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="14.9" cy="13.9" r="2.5" fill="none" stroke="#FCD34D" strokeWidth="1" />
      <path d="M17.3 14.8q1.6 2 .6 4.6" fill="none" stroke="#FCD34D" strokeWidth="0.7" />
      <path
        d={hungry ? "M10.4 19q1.6-1 3.2 0" : "M10.4 18.2q1.6.9 3.2-.4"}
        fill="none"
        stroke={INK}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      {hungry ? <Tear /> : null}
    </>
  );
}

function Optimizer({ fill, hungry }: AvatarProps) {
  return (
    <>
      <circle cx="12" cy="14" r="9" fill={fill} />
      <Highlight />
      <path d="M5.2 9.2a6.8 5.6 0 0 1 13.6 0z" fill="#C8A97E" />
      <ellipse cx="12" cy="9.2" rx="9" ry="1.5" fill="#A8865A" />
      <path d="M12 3.6l-1.4-1.8M12 3.6l1.4-1.8" stroke="#A8865A" strokeWidth="1" strokeLinecap="round" />
      <circle cx="9" cy="14.2" r="2.7" fill="#F8FAFC" stroke={INK} strokeWidth="1.1" />
      <circle cx="15" cy="14.2" r="2.7" fill="#F8FAFC" stroke={INK} strokeWidth="1.1" />
      <path d="M11.7 14h.6" stroke={INK} strokeWidth="1.1" />
      <circle cx="9.4" cy="13.6" r="1.1" fill={INK} />
      <circle cx="15.4" cy="13.6" r="1.1" fill={INK} />
      <circle cx="12" cy="19.4" r={hungry ? 0.6 : 0.9} fill={INK} />
      {hungry ? <Tear /> : null}
    </>
  );
}

function Robber({ fill, hungry }: AvatarProps) {
  return (
    <>
      <circle cx="12" cy="14" r="9" fill={fill} />
      <path d="M4.2 18.5h15.6l-1.1 1.5H5.3zM7 21.5h10l-2.6 1.1H9.6z" fill={INK} />
      <path d="M4.6 9.6a7.4 6.2 0 0 1 14.8 0z" fill={INK} />
      <circle cx="12" cy="3.6" r="1.4" fill={INK} />
      <rect x="3" y="10.6" width="18" height="4.4" rx="2.2" fill={INK} />
      <path d="M20.4 11.6l3-1.6-.6 2.6zM20.4 14l3 1.6-.6-2.6z" fill={INK} />
      <circle cx="9" cy="12.8" r="1.5" fill="#fff" />
      <circle cx="15" cy="12.8" r="1.5" fill="#fff" />
      <circle cx="9.6" cy="12.8" r="0.75" fill={INK} />
      <circle cx="15.6" cy="12.8" r="0.75" fill={INK} />
      <path
        d={hungry ? "M10.2 17.4q1.8-1 3.6 0" : "M10 16.8q2 1 4-.5"}
        fill="none"
        stroke={INK}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      {hungry ? <Tear /> : null}
    </>
  );
}

const AVATARS: Record<AgentType, (props: AvatarProps) => ReactNode> = {
  HARDWORKER_COPYCAT: HardWorker,
  CONTENTED_ALTRUIST: Contented,
  TALENTED_GRUDGER: Talented,
  ARISTOCRAT_VIP: Aristocrat,
  OPTIMIZER_DETECTIVE: Optimizer,
  ROBBER_OPPORTUNIST: Robber,
};

export const AgentAvatar = memo(function AgentAvatar({
  type,
  hungry,
  size,
}: {
  type: AgentType;
  hungry: boolean;
  size: number;
}) {
  const Avatar = AVATARS[type];
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      overflow="visible"
      aria-hidden
      className="relative block"
    >
      <Avatar fill={AGENT_THEME[type].fill} hungry={hungry} />
    </svg>
  );
});
